# AGENTS.md — Roommate Peace AI

## Project Overview

Build a single-page web app called **Roommate Peace AI**.
It helps users resolve roommate conflicts by analyzing their situation,
rewriting their message calmly, and generating a fair roommate agreement.

**Tech Stack:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- OpenAI API — model: `gpt-4o-mini` only
- Deployment: Vercel

**Goal:** A clean, mobile-friendly, one-page app with three features:
Analyze, Rewrite, and Agreement. No authentication. No database. No extra dependencies.

---

## Folder Structure
roommate-peace-ai/
├── app/
│ ├── layout.tsx
│ ├── page.tsx
│ ├── globals.css
│ └── api/
│ ├── analyze/route.ts
│ ├── rewrite/route.ts
│ └── agreement/route.ts
├── components/
│ ├── ConflictForm.tsx
│ ├── ResultCard.tsx
│ └── SampleScenarios.tsx
├── lib/
│ └── openai.ts
├── .env.local.example
├── package.json
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
└── next.config.ts

text

---

## package.json

```json
{
  "name": "roommate-peace-ai",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.2.3",
    "react": "^18",
    "react-dom": "^18",
    "openai": "^4.47.1"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "tailwindcss": "^3.4.1",
    "autoprefixer": "^10.0.1",
    "postcss": "^8"
  }
}
```

---

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## tailwind.config.ts

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#6366f1",
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## postcss.config.js

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

---

## next.config.ts

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

---

## .env.local.example
OPENAI_API_KEY=your_openai_api_key_here

text

---

## lib/openai.ts

```ts
import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
```

---

## app/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #f9fafb;
  font-family: system-ui, sans-serif;
}
```

---

## app/layout.tsx

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roommate Peace AI",
  description: "Resolve roommate conflicts with AI — calmly, fairly, instantly.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

---

## API Routes

### app/api/analyze/route.ts

```ts
import { NextRequest } from "next/server";
import { openai } from "@/lib/openai";

export async function POST(req: NextRequest) {
  const { situation, conflictType } = await req.json();

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

  const raw = completion.choices.message.content ?? "{}";
  const data = JSON.parse(raw);
  return Response.json(data);
}
```

---

### app/api/rewrite/route.ts

```ts
import { NextRequest } from "next/server";
import { openai } from "@/lib/openai";

export async function POST(req: NextRequest) {
  const { message, style } = await req.json();

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

  const rewrite = completion.choices.message.content ?? "";
  return Response.json({ rewrite });
}
```

---

### app/api/agreement/route.ts

```ts
import { NextRequest } from "next/server";
import { openai } from "@/lib/openai";

export async function POST(req: NextRequest) {
  const { topic, details } = await req.json();

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

  const raw = completion.choices.message.content ?? "{}";
  const data = JSON.parse(raw);
  return Response.json(data);
}
```

---

## components/ResultCard.tsx

```tsx
export default function ResultCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
      <h3 className="text-lg font-semibold text-indigo-600 mb-3">{title}</h3>
      <div className="text-gray-700 text-sm leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}
```

---

## components/SampleScenarios.tsx

```tsx
const samples = [
  {
    label: "Late night guests",
    situation:
      "My roommate keeps bringing friends over past midnight and I have early classes.",
    conflictType: "Noise",
  },
  {
    label: "Dirty dishes",
    situation:
      "My roommate never does their dishes and the sink is always full.",
    conflictType: "Cleanliness",
  },
  {
    label: "Used groceries",
    situation:
      "My roommate uses my groceries without asking and doesn't replace them.",
    conflictType: "Expenses",
  },
];

export default function SampleScenarios({
  onSelect,
}: {
  onSelect: (situation: string, conflictType: string) => void;
}) {
  return (
    <div className="mt-4">
      <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">
        Try a sample
      </p>
      <div className="flex flex-wrap gap-2">
        {samples.map((s) => (
          <button
            key={s.label}
            onClick={() => onSelect(s.situation, s.conflictType)}
            className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full px-3 py-1 hover:bg-indigo-100 transition"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
```

---

## app/page.tsx

```tsx
"use client";

import { useState } from "react";
import ResultCard from "@/components/ResultCard";
import SampleScenarios from "@/components/SampleScenarios";

type Tab = "analyze" | "rewrite" | "agreement";

const CONFLICT_TYPES = ["Chores", "Noise", "Guests", "Cleanliness", "Expenses"];
const REWRITE_STYLES = ["calm", "firm", "friendly"] as const;

export default function Home() {
  const [tab, setTab] = useState<Tab>("analyze");

  // Analyze state
  const [situation, setSituation] = useState("");
  const [conflictType, setConflictType] = useState("Noise");
  const [analysis, setAnalysis] = useState<Record<string, string> | null>(null);

  // Rewrite state
  const [message, setMessage] = useState("");
  const [style, setStyle] = useState<"calm" | "firm" | "friendly">("calm");
  const [rewrite, setRewrite] = useState("");

  // Agreement state
  const [topic, setTopic] = useState("");
  const [details, setDetails] = useState("");
  const [agreement, setAgreement] = useState<{
    title: string;
    rules: string[];
    consequence: string;
    review_date: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function callApi(endpoint: string, body: object) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("API error");
      return await res.json();
    } catch {
      setError("Something went wrong. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function handleAnalyze() {
    const data = await callApi("analyze", { situation, conflictType });
    if (data) setAnalysis(data);
  }

  async function handleRewrite() {
    const data = await callApi("rewrite", { message, style });
    if (data) setRewrite(data.rewrite);
  }

  async function handleAgreement() {
    const data = await callApi("agreement", { topic, details });
    if (data) setAgreement(data);
  }

  const tabClass = (t: Tab) =>
    `px-4 py-2 rounded-full text-sm font-medium transition ${
      tab === t
        ? "bg-indigo-600 text-white"
        : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300"
    }`;

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">🏠 Roommate Peace AI</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Resolve conflicts calmly. Communicate clearly. Live together better.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 justify-center mb-8 flex-wrap">
          <button className={tabClass("analyze")} onClick={() => setTab("analyze")}>
            🔍 Analyze
          </button>
          <button className={tabClass("rewrite")} onClick={() => setTab("rewrite")}>
            ✏️ Rewrite
          </button>
          <button className={tabClass("agreement")} onClick={() => setTab("agreement")}>
            📋 Agreement
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-4 border border-red-200">
            {error}
          </div>
        )}

        {/* Analyze Tab */}
        {tab === "analyze" && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Describe your situation</h2>
            <select
              value={conflictType}
              onChange={(e) => setConflictType(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              {CONFLICT_TYPES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <textarea
              rows={4}
              placeholder="Describe what happened..."
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <SampleScenarios
              onSelect={(s, c) => {
                setSituation(s);
                setConflictType(c);
              }}
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !situation.trim()}
              className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {loading ? "Analyzing..." : "Analyze Conflict"}
            </button>
            {analysis && (
              <ResultCard title="Conflict Analysis">
                <p><span className="font-medium text-gray-800">Issue:</span> {analysis.issue}</p>
                <p><span className="font-medium text-gray-800">Tone:</span> {analysis.tone}</p>
                <p>
                  <span className="font-medium text-gray-800">Severity:</span>{" "}
                  <span
                    className={
                      analysis.severity === "high"
                        ? "text-red-500"
                        : analysis.severity === "medium"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }
                  >
                    {analysis.severity}
                  </span>
                </p>
                <p><span className="font-medium text-gray-800">Their likely reaction:</span> {analysis.likely_reaction}</p>
                <p><span className="font-medium text-gray-800">Tip:</span> {analysis.advice}</p>
              </ResultCard>
            )}
          </div>
        )}

        {/* Rewrite Tab */}
        {tab === "rewrite" && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Rewrite your message</h2>
            <textarea
              rows={4}
              placeholder="Paste your draft message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <div className="flex gap-2 mt-3 flex-wrap">
              {REWRITE_STYLES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`px-4 py-1.5 rounded-full text-sm border transition ${
                    style === s
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            <button
              onClick={handleRewrite}
              disabled={loading || !message.trim()}
              className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {loading ? "Rewriting..." : "Rewrite Message"}
            </button>
            {rewrite && (
              <ResultCard title={`${style.charAt(0).toUpperCase() + style.slice(1)} Version`}>
                <p className="whitespace-pre-wrap">{rewrite}</p>
                <button
                  onClick={() => navigator.clipboard.writeText(rewrite)}
                  className="mt-3 text-xs text-indigo-500 hover:underline"
                >
                  Copy to clipboard
                </button>
              </ResultCard>
            )}
          </div>
        )}

        {/* Agreement Tab */}
        {tab === "agreement" && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Generate a roommate agreement</h2>
            <input
              type="text"
              placeholder="Topic (e.g. Chores, Noise, Guests)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <textarea
              rows={3}
              placeholder="Any specific details or preferences..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button
              onClick={handleAgreement}
              disabled={loading || !topic.trim()}
              className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {loading ? "Generating..." : "Generate Agreement"}
            </button>
            {agreement && (
              <ResultCard title={agreement.title}>
                <ul className="list-disc list-inside space-y-1">
                  {agreement.rules.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
                <p className="mt-3">
                  <span className="font-medium text-gray-800">If broken:</span>{" "}
                  {agreement.consequence}
                </p>
                <p>
                  <span className="font-medium text-gray-800">Review:</span>{" "}
                  {agreement.review_date}
                </p>
              </ResultCard>
            )}
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-10">
          Built with OpenAI · Roommate Peace AI · Handshake Codex Creator Challenge
        </p>
      </div>
    </main>
  );
}
```

---

## Codex Build Instructions

Run these in order. Do not skip any step.

1. Generate all files listed above in the exact folder structure shown.
2. Do not add placeholder comments or TODO notes — every file must be fully implemented.
3. Do not install any additional libraries beyond what is listed in package.json.
4. After generating all files, execute: `npm install && npm run build`
5. Fix any TypeScript or build errors before finishing.
6. The final app must pass `npm run build` with zero errors.

---

## Codex Credit Optimization Rules

- Use `model: "gpt-4o-mini"` in every OpenAI call — never gpt-4o or gpt-4-turbo.
- Set `max_tokens: 300` on every call — outputs are structured JSON or short text.
- Use `temperature: 0.7` — low enough for consistency, high enough for natural language.
- No streaming, no function calling, no embeddings — plain chat completions only.
- Three API routes, one model call each — total cost per full user session is under $0.01.

---

## Vercel Deployment Steps

1. Push repo to GitHub.
2. Go to vercel.com → New Project → Import repo.
3. Add environment variable: `OPENAI_API_KEY` = your key.
4. Click Deploy. Zero config needed.

---

## Success Criteria

- `npm run build` passes with zero errors.
- All three features return correct AI output.
- App is fully responsive on mobile.
- Sample scenario buttons auto-fill the Analyze tab.
- Copy to clipboard works on Rewrite output.
- No external UI libraries — Tailwind only.
