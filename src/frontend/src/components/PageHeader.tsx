import { motion } from "motion/react";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex items-start justify-between px-6 py-5 border-b border-[oklch(0.15_0.04_220)] bg-[oklch(0.07_0.018_242_/_0.8)] backdrop-blur-sm"
    >
      <div>
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-[oklch(0.85_0.2_196)] shadow-[0_0_8px_oklch(0.85_0.2_196_/_0.8)] rounded-full" />
          <h1 className="font-display text-lg font-bold tracking-[0.15em] text-[oklch(0.92_0.08_196)] uppercase">
            {title}
          </h1>
        </div>
        {subtitle && (
          <p className="font-mono text-[11px] text-[oklch(0.4_0.05_220)] tracking-[0.1em] mt-1 ml-4 pl-3">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </motion.div>
  );
}
