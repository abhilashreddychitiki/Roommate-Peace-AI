import { NextRequest } from "next/server";
import { getOpenAI } from "@/lib/openai";

export async function POST(req: NextRequest) {
  const { message, style } = (await req.json()) as {
    message: string;
    style: string;
  };
  const openai = getOpenAI();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 300,
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content: `You are a communication coach. Rewrite the user's message in a ${style} tone.
Rules:
- Keep the core point intact
- Remove blame, insults, and passive aggression
- Be specific and solution-focused
- Maximum 4 sentences
Return only the rewritten message. No extra text.`,
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  const rewrite = completion.choices[0]?.message?.content ?? "";

  return Response.json({ rewrite });
}
