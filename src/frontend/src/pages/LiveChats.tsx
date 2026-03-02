import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import {
  Bot,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock,
  MessageSquare,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { BotStep, type ChatSession, MessageRole } from "../backend.d";
import { PageHeader } from "../components/PageHeader";
import { useActor } from "../hooks/useActor";

const stepLabels: Record<BotStep, string> = {
  [BotStep.greeting]: "GREETING",
  [BotStep.askProduct]: "ASK PRODUCT",
  [BotStep.askQuantity]: "ASK QUANTITY",
  [BotStep.askAddress]: "ASK ADDRESS",
  [BotStep.askContact]: "ASK CONTACT",
  [BotStep.confirmOrder]: "CONFIRM",
  [BotStep.complete]: "COMPLETE",
};

const stepOrder = [
  BotStep.greeting,
  BotStep.askProduct,
  BotStep.askQuantity,
  BotStep.askAddress,
  BotStep.askContact,
  BotStep.confirmOrder,
  BotStep.complete,
];

function formatTs(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const d = new Date(ms);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDateTs(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StepProgress({ currentStep }: { currentStep: BotStep }) {
  const currentIndex = stepOrder.indexOf(currentStep);
  return (
    <div className="flex items-center gap-0.5 flex-wrap">
      {stepOrder.map((step, i) => (
        <div key={step} className="flex items-center gap-0.5">
          <div
            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              i < currentIndex
                ? "bg-[oklch(0.85_0.2_196)] shadow-[0_0_4px_oklch(0.85_0.2_196_/_0.8)]"
                : i === currentIndex
                  ? "bg-[oklch(0.82_0.19_80)] shadow-[0_0_4px_oklch(0.82_0.19_80_/_0.8)] animate-pulse"
                  : "bg-[oklch(0.2_0.04_220)]"
            }`}
          />
          {i < stepOrder.length - 1 && (
            <div
              className={`w-3 h-px flex-shrink-0 ${
                i < currentIndex
                  ? "bg-[oklch(0.85_0.2_196_/_0.4)]"
                  : "bg-[oklch(0.15_0.03_220)]"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// Sample sessions for when no real data exists
const sampleSessions = [
  {
    id: 1n,
    customerName: "Alex Chen",
    contactInfo: "alex.chen@email.com",
    messages: [
      {
        role: MessageRole.bot,
        content: "Hello! I'm SellerBot. What product would you like to order?",
        timestamp: BigInt(Date.now() - 600000) * 1_000_000n,
      },
      {
        role: MessageRole.user,
        content: "I want to order Wireless Earbuds",
        timestamp: BigInt(Date.now() - 580000) * 1_000_000n,
      },
      {
        role: MessageRole.bot,
        content: "Great choice! How many units would you like?",
        timestamp: BigInt(Date.now() - 570000) * 1_000_000n,
      },
      {
        role: MessageRole.user,
        content: "Just 1 please",
        timestamp: BigInt(Date.now() - 560000) * 1_000_000n,
      },
    ],
    createdAt: BigInt(Date.now() - 600000) * 1_000_000n,
    currentStep: BotStep.askAddress,
  },
  {
    id: 2n,
    customerName: "Sarah Miller",
    contactInfo: "+1 555-0102",
    messages: [
      {
        role: MessageRole.bot,
        content: "Welcome! What can I help you order today?",
        timestamp: BigInt(Date.now() - 3600000) * 1_000_000n,
      },
      {
        role: MessageRole.user,
        content: "LED Desk Lamp x2",
        timestamp: BigInt(Date.now() - 3550000) * 1_000_000n,
      },
    ],
    createdAt: BigInt(Date.now() - 3600000) * 1_000_000n,
    currentStep: BotStep.complete,
  },
  {
    id: 3n,
    customerName: "Unknown",
    contactInfo: undefined,
    messages: [
      {
        role: MessageRole.bot,
        content:
          "Hi! I'm SellerBot AI, your automated order assistant. What's your name?",
        timestamp: BigInt(Date.now() - 120000) * 1_000_000n,
      },
    ],
    createdAt: BigInt(Date.now() - 120000) * 1_000_000n,
    currentStep: BotStep.greeting,
  },
];

function ChatSessionCard({
  session,
  isActive,
  onClick,
}: {
  session: (typeof sampleSessions)[0] | ChatSession;
  isActive: boolean;
  onClick: () => void;
}) {
  const lastMessage = session.messages[session.messages.length - 1];
  const isComplete = session.currentStep === BotStep.complete;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-4 border-b border-[oklch(0.12_0.03_230)] transition-all duration-200 ${
        isActive
          ? "bg-[oklch(0.85_0.2_196_/_0.08)] border-l-2 border-l-[oklch(0.85_0.2_196)]"
          : "hover:bg-[oklch(0.85_0.2_196_/_0.03)]"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-8 h-8 rounded-sm flex-shrink-0 flex items-center justify-center mt-0.5 ${
            isComplete
              ? "bg-[oklch(0.78_0.19_155_/_0.12)] text-[oklch(0.78_0.19_155)]"
              : "bg-[oklch(0.65_0.18_255_/_0.12)] text-[oklch(0.65_0.18_255)]"
          }`}
        >
          {isComplete ? <CheckCircle2 size={14} /> : <CircleDot size={14} />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[11px] text-[oklch(0.75_0.08_200)] truncate">
              {(session as ChatSession).customerName ||
                (session as (typeof sampleSessions)[0]).customerName ||
                "Guest"}
            </span>
            <span className="font-mono text-[9px] text-[oklch(0.3_0.04_220)] flex-shrink-0 ml-2">
              {formatDateTs(session.createdAt)}
            </span>
          </div>

          {lastMessage && (
            <p className="font-mono text-[10px] text-[oklch(0.4_0.05_220)] truncate mb-1.5">
              {lastMessage.content}
            </p>
          )}

          <div className="flex items-center justify-between">
            <StepProgress currentStep={session.currentStep} />
            <span className="font-mono text-[8px] tracking-[0.15em] text-[oklch(0.3_0.04_220)] ml-2">
              {stepLabels[session.currentStep]}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

function MessageBubble({
  msg,
}: { msg: { role: MessageRole; content: string; timestamp: bigint } }) {
  const isBot = msg.role === MessageRole.bot;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isBot ? "" : "flex-row-reverse"}`}
    >
      <div
        className={`w-6 h-6 rounded-sm flex-shrink-0 flex items-center justify-center mt-1 ${
          isBot
            ? "bg-[oklch(0.85_0.2_196_/_0.12)] text-[oklch(0.85_0.2_196)]"
            : "bg-[oklch(0.65_0.18_255_/_0.12)] text-[oklch(0.65_0.18_255)]"
        }`}
      >
        {isBot ? <Bot size={12} /> : <User size={12} />}
      </div>
      <div className={`max-w-[75%] ${isBot ? "" : "items-end flex flex-col"}`}>
        <div
          className={`px-3 py-2 rounded-sm font-mono text-[11px] leading-relaxed ${
            isBot
              ? "bg-[oklch(0.09_0.02_240)] border border-[oklch(0.85_0.2_196_/_0.2)] text-[oklch(0.75_0.08_200)] shadow-neon-cyan"
              : "bg-[oklch(0.65_0.18_255_/_0.1)] border border-[oklch(0.65_0.18_255_/_0.3)] text-[oklch(0.75_0.1_220)] shadow-neon-blue"
          }`}
        >
          {msg.content}
        </div>
        <span className="font-mono text-[8px] text-[oklch(0.3_0.04_220)] mt-1 px-1">
          {formatTs(msg.timestamp)}
        </span>
      </div>
    </motion.div>
  );
}

export default function LiveChats() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { actor, isFetching } = useActor();

  // We'll poll sessions from backend (note: no getAllSessions API, so we use sample data)
  // In real scenario, we'd get sessionIds from somewhere
  const { data: sessions, isLoading } = useQuery({
    queryKey: ["sessions-list"],
    queryFn: async () => {
      // No bulk session fetching API exists - return empty to fall back to samples
      return [] as ChatSession[];
    },
    enabled: !!actor && !isFetching,
  });

  const displaySessions = (
    sessions && sessions.length > 0 ? sessions : sampleSessions
  ) as typeof sampleSessions;
  const selectedSession = selectedId
    ? displaySessions.find((s) => s.id.toString() === selectedId)
    : null;

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Live Chat Sessions"
        subtitle="Active customer conversations"
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sessions list */}
        <div className="w-full md:w-80 flex-shrink-0 border-r border-[oklch(0.15_0.04_220)] flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[oklch(0.12_0.03_230)] bg-[oklch(0.07_0.018_242)]">
            <MessageSquare
              size={12}
              className="text-[oklch(0.85_0.2_196_/_0.7)]"
            />
            <span className="font-mono text-[9px] tracking-[0.2em] text-[oklch(0.4_0.05_220)] uppercase">
              {displaySessions.length} Session
              {displaySessions.length !== 1 ? "s" : ""}
            </span>
          </div>

          <ScrollArea className="flex-1">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {["l1", "l2", "l3", "l4"].map((k) => (
                  <Skeleton
                    key={k}
                    className="h-20 bg-[oklch(0.12_0.03_240)] border border-[oklch(0.2_0.05_220)]"
                  />
                ))}
              </div>
            ) : (
              displaySessions.map((s) => (
                <ChatSessionCard
                  key={s.id.toString()}
                  session={s}
                  isActive={selectedId === s.id.toString()}
                  onClick={() =>
                    setSelectedId(
                      selectedId === s.id.toString() ? null : s.id.toString(),
                    )
                  }
                />
              ))
            )}
          </ScrollArea>
        </div>

        {/* Chat detail */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            {selectedSession ? (
              <motion.div
                key={selectedSession.id.toString()}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                {/* Session header */}
                <div className="flex items-center gap-4 px-5 py-3 border-b border-[oklch(0.12_0.03_230)] bg-[oklch(0.07_0.018_242)]">
                  <div className="flex-1">
                    <div className="font-mono text-[12px] text-[oklch(0.75_0.08_200)]">
                      {(selectedSession as { customerName?: string })
                        .customerName || "Guest Customer"}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StepProgress currentStep={selectedSession.currentStep} />
                      <span className="font-mono text-[9px] text-[oklch(0.35_0.05_220)] tracking-wider">
                        {stepLabels[selectedSession.currentStep]}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[9px] text-[oklch(0.35_0.05_220)]">
                    <Clock size={10} />
                    {formatDateTs(selectedSession.createdAt)}
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1">
                  <div className="p-5 space-y-4">
                    {selectedSession.messages.map((msg, i) => (
                      <MessageBubble
                        key={`${msg.role}-${Number(msg.timestamp)}-${i}`}
                        msg={msg}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center p-8"
              >
                <div className="relative w-16 h-16 mb-4">
                  <div className="absolute inset-0 border border-[oklch(0.85_0.2_196_/_0.2)] rotate-45 animate-pulse-glow" />
                  <div className="absolute inset-2 border border-[oklch(0.85_0.2_196_/_0.1)] rotate-[30deg]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MessageSquare
                      size={20}
                      className="text-[oklch(0.85_0.2_196_/_0.4)]"
                    />
                  </div>
                </div>
                <div className="font-mono text-[11px] tracking-[0.2em] text-[oklch(0.3_0.04_220)] uppercase text-center">
                  Select a session to view
                  <br />
                  conversation history
                </div>
                <div className="mt-2 flex items-center gap-1 font-mono text-[9px] text-[oklch(0.25_0.04_220)]">
                  <ChevronRight size={10} />
                  click any session from the list
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
