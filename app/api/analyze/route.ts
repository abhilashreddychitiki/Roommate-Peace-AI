import { NextRequest } from "next/server";
import { getOpenAI } from "@/lib/openai";

export async function POST(req: NextRequest) {
  const { situation, conflictType } = (await req.json()) as {
    situation: string;
    conflictType: string;
  };
  const openai = getOpenAI();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 300,
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content: `You are a calm conflict analyst. Given a roommate situation, return a JSON object with exactly these fields:
{
  "issue": "one-sentence summary of the core issue",
  "tone": "one of: frustrated | passive-aggressive | angry | confused | hurt",
  "severity": "one of: low | medium | high",
  "likely_reaction": "how the other roommate will probably feel reading this",
  "advice": "one practical tip to de-escalate"
}
Only return valid JSON. No markdown. No extra text.`,
      },
      {
        role: "user",
        content: `Conflict type: ${conflictType}\n\nSituation: ${situation}`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const data = JSON.parse(raw);

  return Response.json(data);
}
