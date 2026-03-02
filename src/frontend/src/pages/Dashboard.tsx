import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  CheckCircle,
  Clock,
  Package,
  ShoppingCart,
  TrendingUp,
  Truck,
} from "lucide-react";
import { motion } from "motion/react";
import { OrderStatus } from "../backend.d";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { StatCard } from "../components/TronCard";
import { useAllOrders } from "../hooks/useQueries";

function formatDate(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function RecentOrderRow({
  order,
  index,
}: {
  order: {
    id: bigint;
    customerName: string;
    product: string;
    status: OrderStatus;
    totalAmount: string;
    timestamp: bigint;
  };
  index: number;
}) {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border-b border-[oklch(0.15_0.04_220)] hover:bg-[oklch(0.85_0.2_196_/_0.03)] transition-colors group"
    >
      <td className="px-4 py-3 font-mono text-[10px] text-[oklch(0.4_0.05_220)] tracking-wider">
        #{String(order.id).padStart(4, "0")}
      </td>
      <td className="px-4 py-3 font-mono text-[12px] text-[oklch(0.75_0.08_200)]">
        {order.customerName}
      </td>
      <td className="px-4 py-3 font-mono text-[11px] text-[oklch(0.55_0.06_220)] max-w-[160px] truncate">
        {order.product}
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={order.status} />
      </td>
      <td className="px-4 py-3 font-mono text-[12px] text-[oklch(0.85_0.2_196)] text-right">
        {order.totalAmount}
      </td>
      <td className="px-4 py-3 font-mono text-[10px] text-[oklch(0.35_0.05_220)] text-right">
        {formatDate(order.timestamp)}
      </td>
    </motion.tr>
  );
}

function LoadingSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {["s1", "s2", "s3", "s4"].map((k) => (
          <Skeleton
            key={k}
            className="h-24 bg-[oklch(0.12_0.03_240)] border border-[oklch(0.2_0.05_220)]"
          />
        ))}
      </div>
      <Skeleton className="h-64 bg-[oklch(0.12_0.03_240)] border border-[oklch(0.2_0.05_220)]" />
    </div>
  );
}

export default function Dashboard() {
  const { data: orders = [], isLoading } = useAllOrders();

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === OrderStatus.pending).length,
    confirmed: orders.filter((o) => o.status === OrderStatus.confirmed).length,
    shipped: orders.filter((o) => o.status === OrderStatus.shipped).length,
    delivered: orders.filter((o) => o.status === OrderStatus.delivered).length,
  };

  const recentOrders = [...orders]
    .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
    .slice(0, 8);

  // Sample data shown when no orders exist
  const sampleOrders = [
    {
      id: 1n,
      customerName: "Alex Chen",
      product: "Wireless Earbuds Pro",
      status: OrderStatus.confirmed,
      totalAmount: "$89.99",
      timestamp: BigInt(Date.now() - 3600000) * 1_000_000n,
    },
    {
      id: 2n,
      customerName: "Sarah Miller",
      product: "LED Desk Lamp",
      status: OrderStatus.shipped,
      totalAmount: "$45.00",
      timestamp: BigInt(Date.now() - 7200000) * 1_000_000n,
    },
    {
      id: 3n,
      customerName: "James Park",
      product: "Mechanical Keyboard",
      status: OrderStatus.pending,
      totalAmount: "$125.00",
      timestamp: BigInt(Date.now() - 10800000) * 1_000_000n,
    },
    {
      id: 4n,
      customerName: "Maria Garcia",
      product: "USB-C Hub",
      status: OrderStatus.delivered,
      totalAmount: "$35.50",
      timestamp: BigInt(Date.now() - 86400000) * 1_000_000n,
    },
    {
      id: 5n,
      customerName: "Tom Watson",
      product: "Phone Stand",
      status: OrderStatus.pending,
      totalAmount: "$22.00",
      timestamp: BigInt(Date.now() - 172800000) * 1_000_000n,
    },
  ];

  const displayOrders = orders.length > 0 ? recentOrders : sampleOrders;
  const displayStats =
    orders.length > 0
      ? stats
      : { total: 24, pending: 7, confirmed: 9, shipped: 5, delivered: 3 };

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Command Center"
        subtitle="Real-time order intelligence grid"
        actions={
          <Link
            to="/chat"
            className="flex items-center gap-2 px-4 py-2 border border-[oklch(0.85_0.2_196_/_0.5)] text-[oklch(0.85_0.2_196)] rounded-sm font-mono text-[11px] tracking-[0.15em] uppercase hover:bg-[oklch(0.85_0.2_196)] hover:text-[oklch(0.06_0.015_240)] transition-all duration-200 shadow-neon-cyan hover:shadow-neon-cyan-strong"
          >
            <Bot size={13} />
            START CHAT
          </Link>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Orders"
            value={displayStats.total}
            icon={<ShoppingCart size={18} />}
            glowColor="cyan"
            delay={0}
          />
          <StatCard
            label="Pending"
            value={displayStats.pending}
            icon={<Clock size={18} />}
            glowColor="amber"
            delay={0.08}
          />
          <StatCard
            label="Confirmed"
            value={displayStats.confirmed}
            icon={<CheckCircle size={18} />}
            glowColor="green"
            delay={0.16}
          />
          <StatCard
            label="Shipped"
            value={displayStats.shipped}
            icon={<Truck size={18} />}
            glowColor="blue"
            delay={0.24}
          />
        </div>

        {/* Quick action banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <Link
            to="/chat"
            className="group flex items-center gap-4 p-4 bg-[oklch(0.85_0.2_196_/_0.06)] border border-[oklch(0.85_0.2_196_/_0.25)] rounded-sm hover:border-[oklch(0.85_0.2_196_/_0.5)] hover:bg-[oklch(0.85_0.2_196_/_0.1)] transition-all duration-200 shadow-neon-cyan"
          >
            <div className="w-10 h-10 rounded-sm bg-[oklch(0.85_0.2_196_/_0.12)] flex items-center justify-center text-[oklch(0.85_0.2_196)] flex-shrink-0">
              <Bot size={20} />
            </div>
            <div className="flex-1">
              <div className="font-mono text-[11px] tracking-[0.15em] text-[oklch(0.85_0.2_196)] uppercase font-medium">
                Customer Chat Bot
              </div>
              <div className="font-mono text-[10px] text-[oklch(0.4_0.05_220)] mt-0.5">
                Demo the automated order collection flow
              </div>
            </div>
            <ArrowRight
              size={14}
              className="text-[oklch(0.85_0.2_196)] group-hover:translate-x-1 transition-transform"
            />
          </Link>

          <Link
            to="/orders"
            className="group flex items-center gap-4 p-4 bg-[oklch(0.65_0.18_255_/_0.06)] border border-[oklch(0.65_0.18_255_/_0.25)] rounded-sm hover:border-[oklch(0.65_0.18_255_/_0.5)] hover:bg-[oklch(0.65_0.18_255_/_0.1)] transition-all duration-200 shadow-neon-blue"
          >
            <div className="w-10 h-10 rounded-sm bg-[oklch(0.65_0.18_255_/_0.12)] flex items-center justify-center text-[oklch(0.65_0.18_255)] flex-shrink-0">
              <TrendingUp size={20} />
            </div>
            <div className="flex-1">
              <div className="font-mono text-[11px] tracking-[0.15em] text-[oklch(0.65_0.18_255)] uppercase font-medium">
                Manage Orders
              </div>
              <div className="font-mono text-[10px] text-[oklch(0.4_0.05_220)] mt-0.5">
                View, filter, and update order statuses
              </div>
            </div>
            <ArrowRight
              size={14}
              className="text-[oklch(0.65_0.18_255)] group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </motion.div>

        {/* Recent Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-[oklch(0.09_0.02_240)] border border-[oklch(0.85_0.2_196_/_0.2)] rounded-sm overflow-hidden shadow-neon-cyan"
        >
          <div className="flex items-center justify-between px-5 py-3 border-b border-[oklch(0.15_0.04_220)] bg-[oklch(0.07_0.018_242)]">
            <div className="flex items-center gap-2">
              <Package size={14} className="text-[oklch(0.85_0.2_196)]" />
              <span className="font-mono text-[11px] tracking-[0.2em] text-[oklch(0.6_0.08_200)] uppercase">
                Recent Transactions
              </span>
            </div>
            <Link
              to="/orders"
              className="flex items-center gap-1 font-mono text-[10px] text-[oklch(0.85_0.2_196_/_0.6)] hover:text-[oklch(0.85_0.2_196)] tracking-wider uppercase transition-colors"
            >
              VIEW ALL <ArrowRight size={10} className="ml-0.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[oklch(0.15_0.04_220)]">
                  <th className="px-4 py-2 text-left font-mono text-[9px] tracking-[0.25em] text-[oklch(0.85_0.2_196_/_0.7)] uppercase">
                    ID
                  </th>
                  <th className="px-4 py-2 text-left font-mono text-[9px] tracking-[0.25em] text-[oklch(0.85_0.2_196_/_0.7)] uppercase">
                    Customer
                  </th>
                  <th className="px-4 py-2 text-left font-mono text-[9px] tracking-[0.25em] text-[oklch(0.85_0.2_196_/_0.7)] uppercase">
                    Product
                  </th>
                  <th className="px-4 py-2 text-left font-mono text-[9px] tracking-[0.25em] text-[oklch(0.85_0.2_196_/_0.7)] uppercase">
                    Status
                  </th>
                  <th className="px-4 py-2 text-right font-mono text-[9px] tracking-[0.25em] text-[oklch(0.85_0.2_196_/_0.7)] uppercase">
                    Amount
                  </th>
                  <th className="px-4 py-2 text-right font-mono text-[9px] tracking-[0.25em] text-[oklch(0.85_0.2_196_/_0.7)] uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayOrders.map((order, i) => (
                  <RecentOrderRow
                    key={order.id.toString()}
                    order={order}
                    index={i}
                  />
                ))}
                {displayOrders.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center font-mono text-[11px] text-[oklch(0.35_0.05_220)] tracking-wider"
                    >
                      NO TRANSACTIONS FOUND — INITIALIZE FIRST CHAT
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
