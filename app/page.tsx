"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  Check,
  Copy,
  FileText,
  Lightbulb,
  MessageSquareHeart,
  PenLine,
  ShieldCheck,
  Search,
  Sparkles,
  XCircle,
  Zap,
} from "lucide-react";
import ResultCard from "@/components/ResultCard";
import SampleScenarios from "@/components/SampleScenarios";

type Tab = "analyze" | "rewrite" | "agreement";

type AnalysisResult = {
  issue: string;
  tone: string;
  severity: "low" | "medium" | "high";
  likely_reaction: string;
  advice: string;
};

type AgreementResult = {
  title: string;
  rules: string[];
  consequence: string;
  review_date: string;
};

const CONFLICT_TYPES = ["Chores", "Noise", "Guests", "Cleanliness", "Expenses"];
const REWRITE_STYLES = ["calm", "firm", "friendly"] as const;

export default function Home() {
  const [tab, setTab] = useState<Tab>("analyze");

  const [situation, setSituation] = useState("");
  const [conflictType, setConflictType] = useState("Noise");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const [message, setMessage] = useState("");
  const [style, setStyle] = useState<(typeof REWRITE_STYLES)[number]>("calm");
  const [rewrite, setRewrite] = useState("");

  const [topic, setTopic] = useState("");
  const [details, setDetails] = useState("");
  const [agreement, setAgreement] = useState<AgreementResult | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeout = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  async function callApi<T>(endpoint: string, body: object) {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("API error");
      }

      return (await res.json()) as T;
    } catch {
      setError("Something went wrong. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function handleAnalyze() {
    const data = await callApi<AnalysisResult>("analyze", {
      situation,
      conflictType,
    });
    if (data) setAnalysis(data);
  }

  async function handleRewrite() {
    const data = await callApi<{ rewrite: string }>("rewrite", { message, style });
    if (data) setRewrite(data.rewrite);
  }

  async function handleAgreement() {
    const data = await callApi<AgreementResult>("agreement", { topic, details });
    if (data) setAgreement(data);
  }

  const tabClass = (t: Tab) =>
    `relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
      tab === t
        ? "bg-indigo-600 text-white shadow-sm"
        : "bg-transparent text-slate-600 hover:text-indigo-600"
    }`;

  const submitButtonClass =
    "mt-5 flex w-full items-center justify-center rounded-2xl bg-indigo-600 py-3 text-sm font-medium text-white shadow-[0_16px_30px_rgba(79,70,229,0.28)] transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50";

  const fieldClass =
    "w-full rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.04)] outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100";

  async function handleCopy() {
    await navigator.clipboard.writeText(rewrite);
    setCopied(true);
  }

  const EmptyState = ({ text }: { text: string }) => (
    <div className="mt-6 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/70 px-5 py-6 text-center text-sm text-indigo-700">
      <div className="mb-2 inline-flex rounded-full bg-white p-2 text-indigo-500 shadow-sm">
        <Sparkles size={20} />
      </div>
      <p>{text}</p>
    </div>
  );

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px]">
        <div className="absolute left-[-60px] top-14 h-56 w-56 rounded-full bg-indigo-300/30 blur-3xl" />
        <div className="absolute right-[-40px] top-6 h-64 w-64 rounded-full bg-fuchsia-200/40 blur-3xl" />
        <div className="absolute left-1/2 top-28 h-52 w-52 -translate-x-1/2 rounded-full bg-sky-200/30 blur-3xl" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto max-w-2xl"
      >
        <div className="hero-gradient soft-ring mb-8 overflow-hidden rounded-[32px] border border-white/70 px-6 py-8 text-left shadow-[0_24px_80px_rgba(99,102,241,0.12)] sm:px-8 sm:py-10">
          <div className="absolute" />
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600 shadow-sm backdrop-blur">
            <Sparkles size={16} />
            Calm house vibes
          </div>
          <div className="grid gap-8 sm:grid-cols-[1.5fr_0.9fr] sm:items-end">
            <div>
              <h1 className="max-w-lg text-4xl font-semibold tracking-[-0.04em] text-slate-900 sm:text-5xl">
                Roommate Peace AI
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                A calmer way to handle shared-space tension. Analyze what is really
                going on, rewrite heated messages with empathy, and turn conflict into
                simple agreements that actually stick.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="glass-panel rounded-2xl px-4 py-3 text-sm text-slate-700">
                  <div className="flex items-center gap-2 font-medium text-slate-900">
                    <MessageSquareHeart size={18} className="text-pink-500" />
                    Gentler conversations
                  </div>
                  <p className="mt-1 text-xs text-slate-500">De-escalate before things spiral.</p>
                </div>
                <div className="glass-panel rounded-2xl px-4 py-3 text-sm text-slate-700">
                  <div className="flex items-center gap-2 font-medium text-slate-900">
                    <ShieldCheck size={18} className="text-emerald-500" />
                    Fair agreements
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Clear rules, shared expectations.</p>
                </div>
              </div>
            </div>
            <div className="glass-panel rounded-[28px] p-5 shadow-[0_20px_50px_rgba(99,102,241,0.14)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                What you can do
              </p>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl bg-white/80 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                    <Search size={18} className="text-indigo-500" />
                    Understand the conflict
                  </div>
                </div>
                <div className="rounded-2xl bg-white/80 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                    <PenLine size={18} className="text-indigo-500" />
                    Rewrite with the right tone
                  </div>
                </div>
                <div className="rounded-2xl bg-white/80 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                    <FileText size={18} className="text-indigo-500" />
                    Draft an agreement
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel soft-ring mb-8 flex flex-wrap justify-center gap-2 rounded-[24px] p-2">
          <button className={tabClass("analyze")} onClick={() => setTab("analyze")}>
            <Search size={18} />
            Analyze
            {tab === "analyze" && (
              <motion.div
                layoutId="tabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
          </button>
          <button className={tabClass("rewrite")} onClick={() => setTab("rewrite")}>
            <PenLine size={18} />
            Rewrite
            {tab === "rewrite" && (
              <motion.div
                layoutId="tabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
          </button>
          <button className={tabClass("agreement")} onClick={() => setTab("agreement")}>
            <FileText size={18} />
            Agreement
            {tab === "agreement" && (
              <motion.div
                layoutId="tabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <XCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {tab === "analyze" && (
            <motion.div
              key={tab}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
            >
              <motion.div
                whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="glass-panel soft-ring rounded-[28px] p-6 sm:p-7"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-500">
                      Analyze
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">
                      Describe your situation
                    </h2>
                  </div>
                  <div className="hidden rounded-2xl bg-indigo-50 px-3 py-2 text-xs text-indigo-600 sm:block">
                    AI mediator mode
                  </div>
                </div>
                <select
                  value={conflictType}
                  onChange={(e) => setConflictType(e.target.value)}
                  className={`${fieldClass} mb-3`}
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
                  className={`${fieldClass} resize-none`}
                />
                <SampleScenarios
                  onSelect={(selectedSituation, selectedConflictType) => {
                    setSituation(selectedSituation);
                    setConflictType(selectedConflictType);
                  }}
                />
                <motion.button
                  onClick={handleAnalyze}
                  disabled={loading || !situation.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={submitButtonClass}
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                        className="mr-2 inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                      />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap size={18} className="mr-2" />
                      Analyze Conflict
                    </>
                  )}
                </motion.button>
                {analysis ? (
                  <ResultCard title="Conflict Analysis">
                    <p>
                      <span className="font-medium text-gray-800">Issue:</span> {analysis.issue}
                    </p>
                    <p>
                      <span className="font-medium text-gray-800">Tone:</span> {analysis.tone}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">Severity:</span>
                      {analysis.severity === "high" ? (
                        <motion.span
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-red-600"
                        >
                          High
                        </motion.span>
                      ) : (
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${
                            analysis.severity === "medium"
                              ? "bg-amber-100 text-amber-600"
                              : "bg-emerald-100 text-emerald-600"
                          }`}
                        >
                          {analysis.severity}
                        </span>
                      )}
                    </div>
                    <p>
                      <span className="font-medium text-gray-800">Their likely reaction:</span>{" "}
                      {analysis.likely_reaction}
                    </p>
                    <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
                      <Lightbulb size={18} className="mt-0.5 shrink-0 text-amber-500" />
                      <p>
                        <span className="font-medium">Tip:</span> {analysis.advice}
                      </p>
                    </div>
                  </ResultCard>
                ) : (
                  <EmptyState text="Choose a conflict type, describe the situation, and get a calm read on what is really happening." />
                )}
              </motion.div>
            </motion.div>
          )}

          {tab === "rewrite" && (
            <motion.div
              key={tab}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
            >
              <motion.div
                whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="glass-panel soft-ring rounded-[28px] p-6 sm:p-7"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-500">
                      Rewrite
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">
                      Rewrite your message
                    </h2>
                  </div>
                  <div className="hidden rounded-2xl bg-emerald-50 px-3 py-2 text-xs text-emerald-600 sm:block">
                    Tone control
                  </div>
                </div>
                <textarea
                  rows={4}
                  placeholder="Paste your draft message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`${fieldClass} resize-none`}
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {REWRITE_STYLES.map((rewriteStyle) => (
                    <button
                      key={rewriteStyle}
                      onClick={() => setStyle(rewriteStyle)}
                      className={`rounded-full border px-4 py-1.5 text-sm transition ${
                        style === rewriteStyle
                          ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
                          : "border-white/70 bg-white/80 text-gray-600 hover:border-indigo-300"
                      }`}
                    >
                      {rewriteStyle.charAt(0).toUpperCase() + rewriteStyle.slice(1)}
                    </button>
                  ))}
                </div>
                <motion.button
                  onClick={handleRewrite}
                  disabled={loading || !message.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={submitButtonClass}
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                        className="mr-2 inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                      />
                      Rewriting...
                    </>
                  ) : (
                    <>
                      <Zap size={18} className="mr-2" />
                      Rewrite Message
                    </>
                  )}
                </motion.button>
                {rewrite ? (
                  <ResultCard title={`${style.charAt(0).toUpperCase() + style.slice(1)} Version`}>
                    <p className="whitespace-pre-wrap">{rewrite}</p>
                    <motion.button
                      onClick={handleCopy}
                      whileTap={{ scale: 0.9 }}
                      className="mt-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600 transition hover:bg-indigo-100"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      {copied ? "Copied" : "Copy to clipboard"}
                    </motion.button>
                  </ResultCard>
                ) : (
                  <EmptyState text="Draft the message you wish you could send, then turn it into something clear, calm, and roommate-safe." />
                )}
              </motion.div>
            </motion.div>
          )}

          {tab === "agreement" && (
            <motion.div
              key={tab}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
            >
              <motion.div
                whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="glass-panel soft-ring rounded-[28px] p-6 sm:p-7"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-500">
                      Agreement
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">
                      Generate a roommate agreement
                    </h2>
                  </div>
                  <div className="hidden rounded-2xl bg-sky-50 px-3 py-2 text-xs text-sky-600 sm:block">
                    Shared ground rules
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Topic (e.g. Chores, Noise, Guests)"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className={`${fieldClass} mb-3`}
                />
                <textarea
                  rows={3}
                  placeholder="Any specific details or preferences..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className={`${fieldClass} resize-none`}
                />
                <motion.button
                  onClick={handleAgreement}
                  disabled={loading || !topic.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={submitButtonClass}
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                        className="mr-2 inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                      />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap size={18} className="mr-2" />
                      Generate Agreement
                    </>
                  )}
                </motion.button>
                {agreement ? (
                  <ResultCard title={agreement.title}>
                    <div className="space-y-2">
                      {agreement.rules.map((rule, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.08, duration: 0.3 }}
                          className="rounded-xl bg-gray-50 px-4 py-2 text-sm text-gray-700"
                        >
                          {index + 1}. {rule}
                        </motion.div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                      <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                      <p>
                        <span className="font-medium text-gray-800">If broken:</span>{" "}
                        {agreement.consequence}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
                      <CalendarDays size={18} className="shrink-0 text-slate-500" />
                      <p>
                        <span className="font-medium text-gray-800">Review:</span>{" "}
                        {agreement.review_date}
                      </p>
                    </div>
                  </ResultCard>
                ) : (
                  <EmptyState text="Set the topic and a little context to generate a fair, specific agreement both roommates can actually follow." />
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-10 text-center text-xs text-gray-400">
          Built with OpenAI · Roommate Peace AI · Handshake Codex Creator Challenge
        </p>
      </motion.div>
    </main>
  );
}
