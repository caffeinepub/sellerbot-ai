import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import type { ReactNode } from "react";

interface TronCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "cyan" | "blue" | "amber" | "green" | "red";
  animate?: boolean;
}

const glowMap = {
  cyan: "border-[oklch(0.85_0.2_196_/_0.35)] shadow-neon-cyan hover:border-[oklch(0.85_0.2_196_/_0.6)] hover:shadow-neon-cyan-strong",
  blue: "border-[oklch(0.65_0.18_255_/_0.35)] shadow-neon-blue hover:border-[oklch(0.65_0.18_255_/_0.6)]",
  amber:
    "border-[oklch(0.82_0.19_80_/_0.35)] shadow-[0_0_8px_oklch(0.82_0.19_80_/_0.3)] hover:border-[oklch(0.82_0.19_80_/_0.6)]",
  green:
    "border-[oklch(0.78_0.19_155_/_0.35)] shadow-[0_0_8px_oklch(0.78_0.19_155_/_0.3)] hover:border-[oklch(0.78_0.19_155_/_0.6)]",
  red: "border-[oklch(0.62_0.22_15_/_0.35)] shadow-[0_0_8px_oklch(0.62_0.22_15_/_0.3)] hover:border-[oklch(0.62_0.22_15_/_0.6)]",
};

export function TronCard({
  children,
  className,
  glowColor = "cyan",
  animate = false,
}: TronCardProps) {
  const base =
    "bg-[oklch(0.09_0.02_240)] border rounded-sm transition-all duration-300";
  const glow = glowMap[glowColor];

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn(base, glow, className)}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={cn(base, glow, className)}>{children}</div>;
}

// ─── Stat card variant ────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  glowColor?: "cyan" | "blue" | "amber" | "green" | "red";
  delay?: number;
}

const iconBgMap = {
  cyan: "bg-[oklch(0.85_0.2_196_/_0.1)] text-[oklch(0.85_0.2_196)]",
  blue: "bg-[oklch(0.65_0.18_255_/_0.1)] text-[oklch(0.65_0.18_255)]",
  amber: "bg-[oklch(0.82_0.19_80_/_0.1)] text-[oklch(0.82_0.19_80)]",
  green: "bg-[oklch(0.78_0.19_155_/_0.1)] text-[oklch(0.78_0.19_155)]",
  red: "bg-[oklch(0.62_0.22_15_/_0.1)] text-[oklch(0.62_0.22_15)]",
};

const valueColorMap = {
  cyan: "text-[oklch(0.85_0.2_196)] text-glow-cyan",
  blue: "text-[oklch(0.65_0.18_255)] text-glow-blue",
  amber: "text-[oklch(0.82_0.19_80)]",
  green: "text-[oklch(0.78_0.19_155)]",
  red: "text-[oklch(0.62_0.22_15)]",
};

export function StatCard({
  label,
  value,
  icon,
  glowColor = "cyan",
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      <TronCard glowColor={glowColor} className="p-5 relative overflow-hidden">
        {/* Corner decoration */}
        <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden">
          <div
            className={`absolute top-0 right-0 w-0 h-0 border-l-[32px] border-b-[32px] border-l-transparent ${
              glowColor === "cyan"
                ? "border-b-[oklch(0.85_0.2_196_/_0.12)]"
                : glowColor === "blue"
                  ? "border-b-[oklch(0.65_0.18_255_/_0.12)]"
                  : glowColor === "amber"
                    ? "border-b-[oklch(0.82_0.19_80_/_0.12)]"
                    : glowColor === "green"
                      ? "border-b-[oklch(0.78_0.19_155_/_0.12)]"
                      : "border-b-[oklch(0.62_0.22_15_/_0.12)]"
            }`}
          />
        </div>
        <div className="flex items-start justify-between">
          <div>
            <div className="font-mono text-[10px] tracking-[0.25em] text-[oklch(0.4_0.05_220)] uppercase mb-2">
              {label}
            </div>
            <div
              className={`font-display text-3xl font-bold tracking-tight ${valueColorMap[glowColor]}`}
            >
              {value}
            </div>
          </div>
          <div
            className={`w-10 h-10 rounded-sm flex items-center justify-center ${iconBgMap[glowColor]}`}
          >
            {icon}
          </div>
        </div>
      </TronCard>
    </motion.div>
  );
}
