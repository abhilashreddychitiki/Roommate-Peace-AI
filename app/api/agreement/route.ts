import { NextRequest } from "next/server";
import { getOpenAI } from "@/lib/openai";

export async function POST(req: NextRequest) {
  const { topic, details } = (await req.json()) as {
    topic: string;
    details: string;
  };
  const openai = getOpenAI();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 300,
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content: `You are a fair mediator. Create a short roommate agreement for the topic "${topic}".
Return a JSON object with exactly these fields:
{
  "title": "Agreement title",
  "rules": ["rule 1", "rule 2", "rule 3", "rule 4"],
  "consequence": "what happens if rules are broken",
  "review_date": "suggest reviewing in X weeks"
}
Only valid JSON. No markdown. No extra text.`,
      },
      {
        role: "user",
        content: `Topic: ${topic}\nDetails: ${details}`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const data = JSON.parse(raw);

  return Response.json(data);
}
