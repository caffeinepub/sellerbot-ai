import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Hash,
  MapPin,
  Package,
  Phone,
  RefreshCw,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { type Order, OrderStatus } from "../backend.d";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { useAllOrders, useUpdateOrderStatus } from "../hooks/useQueries";

const statusTabs: { label: string; value: OrderStatus | "all" }[] = [
  { label: "ALL", value: "all" },
  { label: "PENDING", value: OrderStatus.pending },
  { label: "CONFIRMED", value: OrderStatus.confirmed },
  { label: "SHIPPED", value: OrderStatus.shipped },
  { label: "DELIVERED", value: OrderStatus.delivered },
  { label: "CANCELLED", value: OrderStatus.cancelled },
];

const nextStatusMap: Partial<Record<OrderStatus, OrderStatus>> = {
  [OrderStatus.pending]: OrderStatus.confirmed,
  [OrderStatus.confirmed]: OrderStatus.shipped,
  [OrderStatus.shipped]: OrderStatus.delivered,
};

function formatDate(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function OrderRow({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  const nextStatus = nextStatusMap[order.status];

  function handleAdvanceStatus() {
    if (!nextStatus) return;
    updateStatus(
      { id: order.id, status: nextStatus },
      {
        onSuccess: () => {
          toast.success(`Order #${order.id} → ${nextStatus.toUpperCase()}`);
        },
        onError: () => {
          toast.error("Failed to update order status");
        },
      },
    );
  }

  return (
    <div className="border-b border-[oklch(0.12_0.03_230)] last:border-0">
      {/* Main row */}
      <button
        type="button"
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[oklch(0.85_0.2_196_/_0.03)] transition-colors text-left"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <div
          className="text-[oklch(0.3_0.05_220)] transition-transform duration-200"
          style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}
        >
          <ChevronRight size={14} />
        </div>

        <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-3 items-center">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[oklch(0.35_0.05_220)] tracking-wider">
              #{String(order.id).padStart(4, "0")}
            </span>
          </div>

          <div className="font-mono text-[12px] text-[oklch(0.75_0.08_200)] truncate">
            {order.customerName}
          </div>

          <div className="font-mono text-[11px] text-[oklch(0.5_0.06_220)] truncate hidden md:block">
            {order.product}
          </div>

          <div>
            <StatusBadge status={order.status} />
          </div>

          <div className="text-right hidden md:block">
            <span className="font-mono text-[12px] text-[oklch(0.85_0.2_196)]">
              {order.totalAmount}
            </span>
          </div>
        </div>
      </button>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-10 py-4 bg-[oklch(0.07_0.018_242)] border-t border-[oklch(0.12_0.03_230)] grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Order details */}
              <div className="space-y-3">
                <div className="font-mono text-[9px] tracking-[0.25em] text-[oklch(0.85_0.2_196_/_0.6)] uppercase mb-3">
                  Order Details
                </div>
                <DetailRow
                  icon={<Package size={12} />}
                  label="Product"
                  value={order.product}
                />
                <DetailRow
                  icon={<Hash size={12} />}
                  label="Quantity"
                  value={String(order.quantity)}
                />
                <DetailRow
                  icon={<MapPin size={12} />}
                  label="Shipping"
                  value={order.shippingAddress}
                />
                <DetailRow
                  icon={<Phone size={12} />}
                  label="Contact"
                  value={order.contactInfo}
                />
                <DetailRow
                  icon={<Calendar size={12} />}
                  label="Created"
                  value={formatDate(order.timestamp)}
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col justify-between">
                <div className="font-mono text-[9px] tracking-[0.25em] text-[oklch(0.85_0.2_196_/_0.6)] uppercase mb-3">
                  Actions
                </div>
                <div className="space-y-2">
                  {nextStatus ? (
                    <button
                      type="button"
                      onClick={handleAdvanceStatus}
                      disabled={isPending}
                      className="flex items-center gap-2 px-4 py-2 border border-[oklch(0.85_0.2_196_/_0.4)] text-[oklch(0.85_0.2_196)] rounded-sm font-mono text-[10px] tracking-[0.12em] uppercase hover:bg-[oklch(0.85_0.2_196)] hover:text-[oklch(0.06_0.015_240)] transition-all duration-200 shadow-neon-cyan disabled:opacity-40 disabled:cursor-not-allowed w-full justify-center"
                    >
                      {isPending ? (
                        <RefreshCw size={11} className="animate-spin" />
                      ) : (
                        <ChevronDown size={11} />
                      )}
                      Mark as {nextStatus}
                    </button>
                  ) : (
                    <div className="font-mono text-[10px] text-[oklch(0.35_0.05_220)] px-4 py-2">
                      No further actions available
                    </div>
                  )}

                  {order.status !== OrderStatus.cancelled && (
                    <button
                      type="button"
                      onClick={() =>
                        updateStatus(
                          { id: order.id, status: OrderStatus.cancelled },
                          {
                            onSuccess: () =>
                              toast.success(`Order #${order.id} cancelled`),
                            onError: () =>
                              toast.error("Failed to cancel order"),
                          },
                        )
                      }
                      disabled={isPending}
                      className="flex items-center gap-2 px-4 py-2 border border-[oklch(0.62_0.22_15_/_0.3)] text-[oklch(0.62_0.22_15_/_0.7)] rounded-sm font-mono text-[10px] tracking-[0.12em] uppercase hover:border-[oklch(0.62_0.22_15_/_0.6)] hover:text-[oklch(0.62_0.22_15)] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed w-full justify-center"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-[oklch(0.85_0.2_196_/_0.5)] mt-0.5 flex-shrink-0">
        {icon}
      </span>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="font-mono text-[9px] tracking-[0.2em] text-[oklch(0.35_0.05_220)] uppercase">
          {label}
        </span>
        <span className="font-mono text-[11px] text-[oklch(0.65_0.07_210)] break-words">
          {value}
        </span>
      </div>
    </div>
  );
}

export default function Orders() {
  const [activeStatus, setActiveStatus] = useState<OrderStatus | "all">("all");
  const { data: orders = [], isLoading, refetch } = useAllOrders();

  const filteredOrders =
    activeStatus === "all"
      ? orders
      : orders.filter((o) => o.status === activeStatus);

  // Sample data
  const sampleOrders: Order[] = [
    {
      id: 1n,
      customerName: "Alex Chen",
      product: "Wireless Earbuds Pro",
      status: OrderStatus.confirmed,
      totalAmount: "$89.99",
      quantity: 1n,
      shippingAddress: "123 Digital Ave, San Francisco, CA 94105",
      contactInfo: "alex.chen@email.com",
      timestamp: BigInt(Date.now() - 3600000) * 1_000_000n,
    },
    {
      id: 2n,
      customerName: "Sarah Miller",
      product: "LED Desk Lamp",
      status: OrderStatus.shipped,
      totalAmount: "$45.00",
      quantity: 2n,
      shippingAddress: "456 Tech Blvd, Austin, TX 78701",
      contactInfo: "+1 555-0102",
      timestamp: BigInt(Date.now() - 7200000) * 1_000_000n,
    },
    {
      id: 3n,
      customerName: "James Park",
      product: "Mechanical Keyboard",
      status: OrderStatus.pending,
      totalAmount: "$125.00",
      quantity: 1n,
      shippingAddress: "789 Code St, Seattle, WA 98101",
      contactInfo: "james.park@gmail.com",
      timestamp: BigInt(Date.now() - 10800000) * 1_000_000n,
    },
    {
      id: 4n,
      customerName: "Maria Garcia",
      product: "USB-C Hub (7-in-1)",
      status: OrderStatus.delivered,
      totalAmount: "$35.50",
      quantity: 3n,
      shippingAddress: "101 Network Rd, Miami, FL 33101",
      contactInfo: "+1 555-0104",
      timestamp: BigInt(Date.now() - 86400000) * 1_000_000n,
    },
    {
      id: 5n,
      customerName: "Tom Watson",
      product: "Adjustable Phone Stand",
      status: OrderStatus.pending,
      totalAmount: "$22.00",
      quantity: 1n,
      shippingAddress: "202 Pixel Lane, New York, NY 10001",
      contactInfo: "tom.w@outlook.com",
      timestamp: BigInt(Date.now() - 172800000) * 1_000_000n,
    },
    {
      id: 6n,
      customerName: "Nina Patel",
      product: "Smart Watch Band",
      status: OrderStatus.cancelled,
      totalAmount: "$18.99",
      quantity: 2n,
      shippingAddress: "303 Binary Blvd, Chicago, IL 60601",
      contactInfo: "+1 555-0106",
      timestamp: BigInt(Date.now() - 259200000) * 1_000_000n,
    },
  ];

  const displayOrders = orders.length > 0 ? filteredOrders : sampleOrders;

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Order Management"
        subtitle="Track and update all customer orders"
        actions={
          <button
            type="button"
            onClick={() => refetch()}
            className="flex items-center gap-2 px-3 py-2 border border-[oklch(0.25_0.07_210)] text-[oklch(0.5_0.06_220)] rounded-sm font-mono text-[10px] tracking-[0.15em] uppercase hover:border-[oklch(0.85_0.2_196_/_0.4)] hover:text-[oklch(0.85_0.2_196)] transition-all duration-200"
          >
            <RefreshCw size={11} />
            REFRESH
          </button>
        }
      />

      {/* Status filter tabs */}
      <div className="flex gap-1 px-5 py-3 border-b border-[oklch(0.12_0.03_230)] bg-[oklch(0.07_0.018_242)] overflow-x-auto">
        {statusTabs.map((tab) => (
          <button
            type="button"
            key={tab.value}
            onClick={() => setActiveStatus(tab.value)}
            className={`
              flex-shrink-0 px-3 py-1.5 rounded-sm font-mono text-[9px] tracking-[0.2em] uppercase transition-all duration-200
              ${
                activeStatus === tab.value
                  ? "bg-[oklch(0.85_0.2_196)] text-[oklch(0.06_0.015_240)] shadow-neon-cyan"
                  : "border border-[oklch(0.2_0.05_220)] text-[oklch(0.4_0.05_220)] hover:border-[oklch(0.85_0.2_196_/_0.3)] hover:text-[oklch(0.65_0.08_200)]"
              }
            `}
          >
            {tab.label}
            {tab.value !== "all" && (
              <span className="ml-1.5 opacity-60">
                (
                {orders.length > 0
                  ? orders.filter(
                      (o) => tab.value === "all" || o.status === tab.value,
                    ).length
                  : sampleOrders.filter((o) => o.status === tab.value).length}
                )
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {["r1", "r2", "r3", "r4", "r5"].map((k) => (
              <Skeleton
                key={k}
                className="h-16 bg-[oklch(0.12_0.03_240)] border border-[oklch(0.2_0.05_220)]"
              />
            ))}
          </div>
        ) : (
          <div className="bg-[oklch(0.09_0.02_240)] border-x-0">
            {/* Table header */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 px-9 py-2 border-b border-[oklch(0.12_0.03_230)] bg-[oklch(0.07_0.018_242)]">
              <span className="font-mono text-[9px] tracking-[0.25em] text-[oklch(0.85_0.2_196_/_0.6)] uppercase">
                ID
              </span>
              <span className="font-mono text-[9px] tracking-[0.25em] text-[oklch(0.85_0.2_196_/_0.6)] uppercase">
                Customer
              </span>
              <span className="font-mono text-[9px] tracking-[0.25em] text-[oklch(0.85_0.2_196_/_0.6)] uppercase hidden md:block">
                Product
              </span>
              <span className="font-mono text-[9px] tracking-[0.25em] text-[oklch(0.85_0.2_196_/_0.6)] uppercase">
                Status
              </span>
              <span className="font-mono text-[9px] tracking-[0.25em] text-[oklch(0.85_0.2_196_/_0.6)] uppercase text-right hidden md:block">
                Amount
              </span>
            </div>

            {displayOrders.length === 0 ? (
              <div className="py-16 text-center">
                <Package
                  size={24}
                  className="mx-auto mb-3 text-[oklch(0.25_0.05_220)]"
                />
                <div className="font-mono text-[11px] tracking-[0.2em] text-[oklch(0.3_0.04_220)] uppercase">
                  No orders found — {activeStatus}
                </div>
              </div>
            ) : (
              displayOrders.map((order) => (
                <motion.div
                  key={order.id.toString()}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <OrderRow order={order} />
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
