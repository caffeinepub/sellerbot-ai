import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bot,
  ExternalLink,
  LayoutDashboard,
  Menu,
  MessageSquare,
  ShoppingCart,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { useState } from "react";

const navItems = [
  { path: "/", label: "DASHBOARD", icon: LayoutDashboard },
  { path: "/orders", label: "ORDERS", icon: ShoppingCart },
  { path: "/chats", label: "LIVE CHATS", icon: MessageSquare },
  { path: "/chat", label: "CUSTOMER CHAT", icon: Bot },
];

function TronLogo() {
  return (
    <div className="flex items-center gap-3 px-4 py-4 border-b border-[oklch(0.25_0.07_210)]">
      <div className="relative w-9 h-9 flex-shrink-0">
        <img
          src="/assets/generated/sellerbot-logo-transparent.dim_80x80.png"
          alt="SellerBot AI Logo"
          className="w-full h-full object-contain"
        />
      </div>
      <div>
        <div className="font-display text-sm font-bold tracking-[0.2em] text-[oklch(0.85_0.2_196)] text-glow-cyan uppercase">
          SellerBot
        </div>
        <div className="font-mono text-[9px] tracking-[0.3em] text-[oklch(0.45_0.06_220)] uppercase">
          AI Commerce Grid
        </div>
      </div>
    </div>
  );
}

function NavItem({
  item,
  isActive,
  onClick,
}: {
  item: (typeof navItems)[0];
  isActive: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      to={item.path}
      onClick={onClick}
      className={`
        relative flex items-center gap-3 px-4 py-3 mx-2 rounded-sm
        font-mono text-[11px] tracking-[0.15em] uppercase transition-all duration-200
        ${
          isActive
            ? "text-[oklch(0.06_0.015_240)] bg-[oklch(0.85_0.2_196)] shadow-neon-cyan"
            : "text-[oklch(0.5_0.08_220)] hover:text-[oklch(0.85_0.2_196)] hover:bg-[oklch(0.85_0.2_196_/_0.07)]"
        }
      `}
    >
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute left-0 top-0 bottom-0 w-[2px] bg-[oklch(0.06_0.015_240)] rounded-full"
        />
      )}
      <Icon
        size={14}
        className={isActive ? "text-[oklch(0.06_0.015_240)]" : ""}
      />
      <span>{item.label}</span>
      {isActive && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[oklch(0.06_0.015_240)]" />
      )}
    </Link>
  );
}

function SystemStatus() {
  return (
    <div className="px-4 py-3 mx-2 mb-4">
      <div className="border border-[oklch(0.25_0.07_210)] rounded-sm p-3 bg-[oklch(0.07_0.018_242)]">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[oklch(0.78_0.19_155)] shadow-[0_0_6px_oklch(0.78_0.19_155_/_0.8)] animate-pulse" />
          <span className="font-mono text-[9px] tracking-[0.2em] text-[oklch(0.45_0.06_220)] uppercase">
            System Online
          </span>
        </div>
        <div className="font-mono text-[9px] text-[oklch(0.35_0.05_220)] tracking-wide">
          BOT v2.4.1 | ICP GRID
        </div>
      </div>
    </div>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div className="flex h-screen bg-[oklch(0.06_0.015_240)] overflow-hidden">
      {/* Background grid overlay */}
      <div className="fixed inset-0 tron-grid animate-grid-pulse pointer-events-none" />

      {/* Mobile menu button */}
      <button
        type="button"
        className="fixed top-4 left-4 z-50 md:hidden p-2 border border-[oklch(0.85_0.2_196_/_0.4)] rounded-sm text-[oklch(0.85_0.2_196)] bg-[oklch(0.06_0.015_240)]"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-30 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: mobileOpen ? 0 : undefined }}
        className={`
          fixed md:static z-40 h-full w-64 flex-shrink-0
          bg-[oklch(0.07_0.018_242)] border-r border-[oklch(0.25_0.07_210)]
          flex flex-col
          transition-transform duration-300 md:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <TronLogo />

        <nav className="flex-1 pt-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              item={item}
              isActive={
                item.path === "/"
                  ? currentPath === "/"
                  : currentPath.startsWith(item.path)
              }
              onClick={() => setMobileOpen(false)}
            />
          ))}
        </nav>

        <SystemStatus />

        {/* Footer branding */}
        <div className="px-4 py-3 border-t border-[oklch(0.15_0.04_220)]">
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[oklch(0.3_0.04_220)] hover:text-[oklch(0.5_0.06_220)] transition-colors"
          >
            <ExternalLink size={9} />
            <span className="font-mono text-[9px] tracking-[0.1em]">
              © {new Date().getFullYear()} Built with ♥ caffeine.ai
            </span>
          </a>
        </div>
      </motion.aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top scanline effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.85_0.2_196_/_0.4)] to-transparent" />

        <div className="flex-1 overflow-y-auto">
          <div className="relative z-10 h-full">{children}</div>
        </div>
      </main>
    </div>
  );
}
