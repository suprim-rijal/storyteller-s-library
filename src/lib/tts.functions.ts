import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  text: z.string().trim().min(1).max(200),
  // Slow, clear reading for young learners.
  slow: z.boolean().optional(),
});

/**
 * Speaks a word with Lovable AI so learners hear real Nepali pronunciation
 * even when their device has no Nepali voice installed.
 */
export const speakWithAi = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("Voice service is not configured.");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": key },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini-tts",
        input: data.text,
        voice: "alloy",
        response_format: "mp3",
        speed: data.slow ? 0.8 : 1,
        instructions:
          "Speak in clear, warm Nepali as a patient teacher for a young child. Pronounce every syllable distinctly.",
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      if (response.status === 429) throw new Error("Too many voice requests right now. Please try again in a moment.");
      if (response.status === 402) throw new Error("The workspace is out of AI credits, so the voice is unavailable.");
      throw new Error(`Voice service error (${response.status}): ${detail.slice(0, 200)}`);
    }

    const bytes = new Uint8Array(await response.arrayBuffer());
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return { audio: btoa(binary), mimeType: "audio/mpeg" };
  });
