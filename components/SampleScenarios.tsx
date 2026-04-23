import { motion } from "framer-motion";

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
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
        Try a sample
      </p>
      <div className="flex flex-wrap gap-2">
        {samples.map((sample) => (
          <motion.button
            key={sample.label}
            onClick={() => onSelect(sample.situation, sample.conflictType)}
            whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(99,102,241,0.15)" }}
            transition={{ type: "spring", stiffness: 300 }}
            className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs text-indigo-700 transition hover:bg-indigo-100"
          >
            {sample.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
