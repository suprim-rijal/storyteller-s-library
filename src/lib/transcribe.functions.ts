import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  /** Base64 encoded recording of the child speaking. */
  audio: z.string().min(1),
  mimeType: z.string().min(3).max(60),
});

/**
 * Turns a short recording into text with Lovable AI so a speaking task can
 * check whether the child really said the word.
 */
export const transcribeSpeech = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("Listening service is not configured.");

    const binary = atob(data.audio);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);

    const form = new FormData();
    form.append("file", new Blob([bytes], { type: data.mimeType }), "speech.webm");
    form.append("model", "google/gemini-3.5-transcribe");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/audio/transcriptions", {
      method: "POST",
      headers: { "Lovable-API-Key": key },
      body: form,
    });

    if (!response.ok) {
      const detail = await response.text();
      if (response.status === 429) throw new Error("Too many tries at once. Please wait a moment.");
      if (response.status === 402) throw new Error("The workspace is out of AI credits, so listening is unavailable.");
      throw new Error(`Listening service error (${response.status}): ${detail.slice(0, 200)}`);
    }

    const result = (await response.json()) as { text?: string };
    return { text: (result.text ?? "").trim() };
  });
