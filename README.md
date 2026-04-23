# Roommate Peace AI

Roommate Peace AI is a polished single-page web app that helps roommates handle conflict with more clarity and less friction. It lets users analyze a tense situation, rewrite a message in a calmer tone, and generate a fair roommate agreement in seconds.

Built with Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Lucide icons, and the OpenAI API.

## Features

- Analyze conflict situations and return a structured breakdown of the issue, tone, severity, likely reaction, and a de-escalation tip.
- Rewrite roommate messages in `calm`, `firm`, or `friendly` tones while keeping the core point intact.
- Generate short roommate agreements with rules, consequences, and a suggested review date.
- Use sample scenarios to quickly test the Analyze flow.
- Copy rewritten messages to the clipboard with visual feedback.
- Enjoy a polished UI with animated transitions, hover states, glassmorphism-inspired cards, and mobile-friendly layouts.

## Tech Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- OpenAI Node SDK
- Framer Motion
- Lucide React

## How It Works

The app has three AI-powered flows, each backed by its own API route:

- `POST /api/analyze`
  Accepts a roommate situation and conflict type, then returns structured JSON describing the conflict.
- `POST /api/rewrite`
  Accepts a draft message and target tone, then returns a rewritten message.
- `POST /api/agreement`
  Accepts an agreement topic and extra context, then returns a short agreement with rules and a review timeline.

All OpenAI calls use:

- `model: "gpt-4o-mini"`
- `max_tokens: 300`
- `temperature: 0.7`

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Create your local environment file

Copy `.env.local.example` to `.env.local` and add your API key:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev` - start the local development server
- `npm run build` - create a production build
- `npm run start` - run the production build locally

## Project Structure

```text
app/
  api/
    agreement/route.ts
    analyze/route.ts
    rewrite/route.ts
  globals.css
  layout.tsx
  page.tsx
components/
  ConflictForm.tsx
  ResultCard.tsx
  SampleScenarios.tsx
lib/
  openai.ts
.env.local.example
next.config.mjs
package.json
postcss.config.js
tailwind.config.ts
tsconfig.json
```

## UI Notes

The current interface includes:

- animated hero section with a shifting gradient background
- sliding tab transitions
- animated result cards
- spring-based button interactions
- staggered agreement rule reveals
- Lucide iconography throughout

## Build Status

The project has been verified with:

```bash
npm run build
```

and currently builds successfully with zero TypeScript errors.

## Deployment

This app is ready for Vercel deployment.

### Vercel steps

1. Push the repository to GitHub.
2. Import the repo into Vercel.
3. Add the `OPENAI_API_KEY` environment variable.
4. Deploy.

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `OPENAI_API_KEY` | Yes | API key used by the OpenAI SDK in server routes |

## Notes

- The OpenAI client is created lazily at request time, so production builds do not require the API key to be present.
- The app does not include authentication or a database.
- The project is intentionally lightweight and focused on a single-page experience.
