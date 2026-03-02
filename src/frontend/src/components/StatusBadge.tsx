import { cn } from "@/lib/utils";
import { OrderStatus } from "../backend.d";

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; dot: string }
> = {
  [OrderStatus.pending]: {
    label: "PENDING",
    color:
      "border-[oklch(0.82_0.19_80_/_0.5)] text-[oklch(0.82_0.19_80)] bg-[oklch(0.82_0.19_80_/_0.08)] shadow-[0_0_6px_oklch(0.82_0.19_80_/_0.2)]",
    dot: "bg-[oklch(0.82_0.19_80)] shadow-[0_0_4px_oklch(0.82_0.19_80_/_0.8)]",
  },
  [OrderStatus.confirmed]: {
    label: "CONFIRMED",
    color:
      "border-[oklch(0.85_0.2_196_/_0.5)] text-[oklch(0.85_0.2_196)] bg-[oklch(0.85_0.2_196_/_0.08)] shadow-[0_0_6px_oklch(0.85_0.2_196_/_0.2)]",
    dot: "bg-[oklch(0.85_0.2_196)] shadow-[0_0_4px_oklch(0.85_0.2_196_/_0.8)]",
  },
  [OrderStatus.shipped]: {
    label: "SHIPPED",
    color:
      "border-[oklch(0.65_0.18_255_/_0.5)] text-[oklch(0.65_0.18_255)] bg-[oklch(0.65_0.18_255_/_0.08)] shadow-[0_0_6px_oklch(0.65_0.18_255_/_0.2)]",
    dot: "bg-[oklch(0.65_0.18_255)] shadow-[0_0_4px_oklch(0.65_0.18_255_/_0.8)]",
  },
  [OrderStatus.delivered]: {
    label: "DELIVERED",
    color:
      "border-[oklch(0.78_0.19_155_/_0.5)] text-[oklch(0.78_0.19_155)] bg-[oklch(0.78_0.19_155_/_0.08)] shadow-[0_0_6px_oklch(0.78_0.19_155_/_0.2)]",
    dot: "bg-[oklch(0.78_0.19_155)] shadow-[0_0_4px_oklch(0.78_0.19_155_/_0.8)]",
  },
  [OrderStatus.cancelled]: {
    label: "CANCELLED",
    color:
      "border-[oklch(0.62_0.22_15_/_0.5)] text-[oklch(0.62_0.22_15)] bg-[oklch(0.62_0.22_15_/_0.08)] shadow-[0_0_6px_oklch(0.62_0.22_15_/_0.2)]",
    dot: "bg-[oklch(0.62_0.22_15)] shadow-[0_0_4px_oklch(0.62_0.22_15_/_0.8)]",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border font-mono text-[9px] tracking-[0.15em] font-medium",
        config.color,
        className,
      )}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot}`}
      />
      {config.label}
    </span>
  );
}
