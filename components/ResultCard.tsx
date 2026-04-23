import { motion } from "framer-motion";

export default function ResultCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
      className="glass-panel soft-ring mt-6 rounded-[24px] p-6"
    >
      <h3 className="mb-3 text-lg font-semibold text-indigo-700">{title}</h3>
      <div className="space-y-2 text-sm leading-relaxed text-gray-700">{children}</div>
    </motion.div>
  );
}
