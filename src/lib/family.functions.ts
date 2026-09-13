import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const pinSchema = z.object({ pin: z.string().regex(/^\d{4}$/), recoveryEmail: z.string().email().optional() });

async function hashPin(pin: string, salt: Uint8Array) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(pin), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: salt as BufferSource, iterations: 120_000, hash: "SHA-256" }, key, 256);
  return Array.from(new Uint8Array(bits), (value) => value.toString(16).padStart(2, "0")).join("");
}

function randomSalt() {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(salt, (value) => value.toString(16).padStart(2, "0")).join("");
}

function saltBytes(hex: string) {
  return new Uint8Array(hex.match(/.{1,2}/g)?.map((part) => Number.parseInt(part, 16)) ?? []);
}

export const getParentControlStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin.from("parent_controls").select("recovery_email").eq("user_id", context.userId).maybeSingle();
    return { configured: Boolean(data), recoveryEmail: data?.recovery_email ?? null };
  });

export const setParentPin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => pinSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const salt = randomSalt();
    const hash = await hashPin(data.pin, saltBytes(salt));
    const recoveryEmail = data.recoveryEmail ?? String(context.claims.email ?? "");
    if (!z.string().email().safeParse(recoveryEmail).success) throw new Error("A verified recovery email is required.");
    const { error } = await supabaseAdmin.from("parent_controls").upsert({ user_id: context.userId, pin_hash: `${salt}:${hash}`, recovery_email: recoveryEmail }, { onConflict: "user_id" });
    if (error) throw new Error("Parent PIN could not be saved.");
    return { ok: true };
  });

export const verifyParentPinCloud = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ pin: z.string().regex(/^\d{4}$/) }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: control } = await supabaseAdmin.from("parent_controls").select("pin_hash").eq("user_id", context.userId).maybeSingle();
    if (!control) return { valid: false, configured: false };
    const [salt, expected] = control.pin_hash.split(":");
    if (!salt || !expected) return { valid: false, configured: true };
    return { valid: (await hashPin(data.pin, saltBytes(salt))) === expected, configured: true };
  });

export const joinClassroomByCode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ code: z.string().regex(/^[A-Z0-9]{6}$/) }).parse(data))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: classroom } = await supabaseAdmin.from("classrooms").select("id,name").eq("join_code", data.code).eq("active", true).maybeSingle();
    if (!classroom) throw new Error("Classroom not found.");
    const { error } = await supabaseAdmin.from("classroom_memberships").upsert({ classroom_id: classroom.id, learner_user_id: context.userId, parent_email: String(context.claims.email ?? "") }, { onConflict: "classroom_id,learner_user_id" });
    if (error) throw new Error("Classroom could not be joined.");
    return { id: classroom.id, name: classroom.name, code: data.code };
  });