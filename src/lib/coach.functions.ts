import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  question: z.string().min(1).max(600),
  context: z.string().max(2000),
});

export const askCoach = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { text: "The coach is not configured yet.", ok: false as const };

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "google/gemini-3.8-flash",
        messages: [
          {
            role: "system",
            content:
              "You are Vitl's friendly nutrition and training coach. Be warm, concrete and brief (max 140 words). Use short paragraphs or up to 4 bullets. Give practical food and workout suggestions with rough calorie/protein numbers when useful. Never give medical advice; suggest a professional for medical questions. Never shame the user.",
          },
          { role: "user", content: `My data today:\n${data.context}\n\nQuestion: ${data.question}` },
        ],
      }),
    });

    if (!res.ok) {
      const message =
        res.status === 429
          ? "The coach is busy right now — try again in a moment."
          : res.status === 402
            ? "AI credits have run out for this workspace. Add credits in Lovable to keep using the coach."
            : "The coach could not answer just now. Please try again.";
      return { text: message, ok: false as const };
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return {
      text: json.choices?.[0]?.message?.content ?? "No answer came back — try rephrasing.",
      ok: true as const,
    };
  });