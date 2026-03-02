import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, CheckCircle2, RefreshCw, Send, User, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { BotStep, MessageRole } from "../backend.d";
import { PageHeader } from "../components/PageHeader";
import { useCreateChatSession, useGetBotResponse } from "../hooks/useQueries";

interface LocalMessage {
  role: MessageRole;
  content: string;
  timestamp: number;
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="flex gap-3"
    >
      <div className="w-7 h-7 rounded-sm flex-shrink-0 flex items-center justify-center bg-[oklch(0.85_0.2_196_/_0.12)] text-[oklch(0.85_0.2_196)] mt-0.5">
        <Bot size={13} />
      </div>
      <div className="px-4 py-3 bg-[oklch(0.09_0.02_240)] border border-[oklch(0.85_0.2_196_/_0.2)] rounded-sm shadow-neon-cyan flex items-center gap-2">
        <span className="font-mono text-[9px] tracking-[0.15em] text-[oklch(0.4_0.05_220)] uppercase">
          Processing
        </span>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full bg-[oklch(0.85_0.2_196_/_0.7)]"
              style={{
                animation: "typing-dot 1.2s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function MessageBubble({ msg }: { msg: LocalMessage }) {
  const isBot = msg.role === MessageRole.bot;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex gap-3 ${isBot ? "" : "flex-row-reverse"}`}
    >
      <div
        className={`w-7 h-7 rounded-sm flex-shrink-0 flex items-center justify-center mt-0.5 ${
          isBot
            ? "bg-[oklch(0.85_0.2_196_/_0.12)] text-[oklch(0.85_0.2_196)]"
            : "bg-[oklch(0.65_0.18_255_/_0.12)] text-[oklch(0.65_0.18_255)]"
        }`}
      >
        {isBot ? <Bot size={13} /> : <User size={13} />}
      </div>
      <div
        className={`max-w-[75%] md:max-w-[65%] ${isBot ? "" : "items-end flex flex-col"}`}
      >
        <div
          className={`px-4 py-3 rounded-sm font-mono text-[12px] leading-relaxed break-words ${
            isBot
              ? "bg-[oklch(0.09_0.02_240)] border border-[oklch(0.85_0.2_196_/_0.25)] text-[oklch(0.8_0.07_200)] shadow-neon-cyan"
              : "bg-[oklch(0.65_0.18_255_/_0.1)] border border-[oklch(0.65_0.18_255_/_0.35)] text-[oklch(0.82_0.09_215)] shadow-neon-blue"
          }`}
        >
          {msg.content}
        </div>
        <span className="font-mono text-[9px] text-[oklch(0.28_0.04_220)] mt-1 px-1">
          {formatTime(msg.timestamp)}
        </span>
      </div>
    </motion.div>
  );
}

function OrderCompleteCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mx-auto max-w-sm border border-[oklch(0.78_0.19_155_/_0.5)] rounded-sm bg-[oklch(0.78_0.19_155_/_0.06)] p-5 shadow-[0_0_20px_oklch(0.78_0.19_155_/_0.2)] text-center"
    >
      <div className="w-10 h-10 rounded-sm bg-[oklch(0.78_0.19_155_/_0.15)] flex items-center justify-center mx-auto mb-3 shadow-[0_0_12px_oklch(0.78_0.19_155_/_0.5)]">
        <CheckCircle2 size={20} className="text-[oklch(0.78_0.19_155)]" />
      </div>
      <div className="font-mono text-[11px] tracking-[0.2em] text-[oklch(0.78_0.19_155)] uppercase mb-1">
        Order Transmitted
      </div>
      <div className="font-mono text-[10px] text-[oklch(0.4_0.05_220)]">
        Customer order has been recorded in the system
      </div>
    </motion.div>
  );
}

export default function CustomerChat() {
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [sessionId, setSessionId] = useState<bigint | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState<BotStep>(BotStep.greeting);
  const [isComplete, setIsComplete] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const createSession = useCreateChatSession();
  const getBotResponse = useGetBotResponse();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollToBottom]);

  const initSession = useCallback(async () => {
    if (initialized) return;
    setInitialized(true);
    try {
      const id = await createSession.mutateAsync();
      setSessionId(id);
      // Get initial bot greeting
      setIsTyping(true);
      const greeting = await getBotResponse.mutateAsync({
        sessionId: id,
        userMessage: "__init__",
      });
      setIsTyping(false);
      setMessages([
        {
          role: MessageRole.bot,
          content: greeting,
          timestamp: Date.now(),
        },
      ]);
    } catch {
      setIsTyping(false);
      setInitialized(false);
      toast.error("Failed to initialize chat session");
      // Add fallback greeting
      setMessages([
        {
          role: MessageRole.bot,
          content:
            "👋 Hello! I'm SellerBot AI, your automated order assistant. May I have your name to get started?",
          timestamp: Date.now(),
        },
      ]);
    }
  }, [initialized, createSession, getBotResponse]);

  useEffect(() => {
    initSession();
  }, [initSession]);

  async function handleSend() {
    const text = inputValue.trim();
    if (!text || isTyping || isComplete) return;

    setInputValue("");
    const userMsg: LocalMessage = {
      role: MessageRole.user,
      content: text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);

    if (!sessionId) {
      // Simulate local bot responses when no session
      setIsTyping(true);
      await new Promise((r) => setTimeout(r, 1200));
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: MessageRole.bot,
          content:
            "I'm still connecting to the server. Please wait a moment...",
          timestamp: Date.now(),
        },
      ]);
      return;
    }

    setIsTyping(true);
    try {
      const response = await getBotResponse.mutateAsync({
        sessionId,
        userMessage: text,
      });
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: MessageRole.bot,
          content: response,
          timestamp: Date.now(),
        },
      ]);

      // Check for completion keywords
      const responseLC = response.toLowerCase();
      if (
        responseLC.includes("order has been placed") ||
        responseLC.includes("order confirmed") ||
        responseLC.includes("order created") ||
        (responseLC.includes("thank you") && responseLC.includes("order"))
      ) {
        setCurrentStep(BotStep.complete);
        setIsComplete(true);
        toast.success("🎉 New order collected and saved!", {
          duration: 5000,
        });
      }
    } catch {
      setIsTyping(false);
      toast.error("Failed to get bot response");
      setMessages((prev) => [
        ...prev,
        {
          role: MessageRole.bot,
          content: "I encountered an error. Please try again.",
          timestamp: Date.now(),
        },
      ]);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleReset() {
    setMessages([]);
    setInputValue("");
    setSessionId(null);
    setIsTyping(false);
    setCurrentStep(BotStep.greeting);
    setIsComplete(false);
    setInitialized(false);
  }

  const botStepProgress = Object.values(BotStep).indexOf(currentStep);

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Customer Chat"
        subtitle="Automated order collection interface"
        actions={
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-2 border border-[oklch(0.25_0.07_210)] text-[oklch(0.5_0.06_220)] rounded-sm font-mono text-[10px] tracking-[0.15em] uppercase hover:border-[oklch(0.85_0.2_196_/_0.4)] hover:text-[oklch(0.85_0.2_196)] transition-all duration-200"
          >
            <RefreshCw size={11} />
            NEW SESSION
          </button>
        }
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 py-2 border-b border-[oklch(0.12_0.03_230)] bg-[oklch(0.07_0.018_242)]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    isComplete
                      ? "bg-[oklch(0.78_0.19_155)] shadow-[0_0_4px_oklch(0.78_0.19_155_/_0.8)]"
                      : isTyping
                        ? "bg-[oklch(0.82_0.19_80)] shadow-[0_0_4px_oklch(0.82_0.19_80_/_0.8)] animate-pulse"
                        : "bg-[oklch(0.85_0.2_196)] shadow-[0_0_4px_oklch(0.85_0.2_196_/_0.8)] animate-pulse"
                  }`}
                />
                <span className="font-mono text-[9px] tracking-[0.15em] text-[oklch(0.4_0.05_220)] uppercase">
                  {isComplete
                    ? "Session Complete"
                    : isTyping
                      ? "Bot Processing"
                      : "Bot Active"}
                </span>
              </div>
              {sessionId && (
                <span className="font-mono text-[9px] text-[oklch(0.3_0.04_220)]">
                  SID: {String(sessionId).padStart(4, "0")}
                </span>
              )}
            </div>
            <div className="font-mono text-[9px] text-[oklch(0.3_0.04_220)] tracking-wider">
              {messages.length} MSG{messages.length !== 1 ? "S" : ""}
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1">
            <div className="p-5 space-y-4 min-h-full">
              <AnimatePresence mode="sync">
                {messages.map((msg, i) => (
                  <MessageBubble
                    key={`${msg.role}-${msg.timestamp}-${i}`}
                    msg={msg}
                  />
                ))}
                {isTyping && <TypingIndicator key="typing" />}
                {isComplete && <OrderCompleteCard key="complete" />}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input area */}
          <div className="border-t border-[oklch(0.15_0.04_220)] p-4 bg-[oklch(0.07_0.018_242)]">
            <div
              className={`flex items-center gap-3 border rounded-sm px-4 py-3 transition-all duration-200 ${
                isComplete
                  ? "border-[oklch(0.3_0.05_220)] opacity-60"
                  : "border-[oklch(0.25_0.07_210)] focus-within:border-[oklch(0.85_0.2_196_/_0.5)] focus-within:shadow-neon-cyan"
              }`}
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping || isComplete}
                placeholder={
                  isComplete
                    ? "Order session complete — start new session"
                    : "Type your message..."
                }
                className="flex-1 bg-transparent font-mono text-[12px] text-[oklch(0.82_0.08_200)] placeholder:text-[oklch(0.3_0.04_220)] outline-none disabled:cursor-not-allowed"
                aria-label="Chat message input"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping || isComplete}
                className="flex-shrink-0 w-8 h-8 rounded-sm flex items-center justify-center bg-[oklch(0.85_0.2_196_/_0.1)] border border-[oklch(0.85_0.2_196_/_0.3)] text-[oklch(0.85_0.2_196)] hover:bg-[oklch(0.85_0.2_196)] hover:text-[oklch(0.06_0.015_240)] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed shadow-neon-cyan hover:shadow-neon-cyan-strong"
                aria-label="Send message"
              >
                <Send size={13} />
              </button>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <Zap size={9} className="text-[oklch(0.85_0.2_196_/_0.4)]" />
              <span className="font-mono text-[9px] tracking-wider text-[oklch(0.28_0.04_220)]">
                ENTER to send — AI-powered order collection
              </span>
            </div>
          </div>
        </div>

        {/* Side panel - bot status */}
        <div className="hidden lg:flex w-64 flex-shrink-0 border-l border-[oklch(0.15_0.04_220)] flex-col bg-[oklch(0.07_0.018_242)]">
          <div className="px-4 py-3 border-b border-[oklch(0.12_0.03_230)]">
            <span className="font-mono text-[9px] tracking-[0.2em] text-[oklch(0.4_0.05_220)] uppercase">
              Bot State Machine
            </span>
          </div>

          <div className="flex-1 p-4 space-y-2">
            {Object.values(BotStep).map((step, i) => {
              const stepIdx = Object.values(BotStep).indexOf(currentStep);
              const isCurrent = step === currentStep;
              const isDone = i < stepIdx;

              return (
                <div
                  key={step}
                  className={`flex items-center gap-3 px-3 py-2 rounded-sm transition-all duration-300 ${
                    isCurrent
                      ? "bg-[oklch(0.85_0.2_196_/_0.08)] border border-[oklch(0.85_0.2_196_/_0.3)]"
                      : isDone
                        ? "opacity-50"
                        : "opacity-25"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      isDone
                        ? "bg-[oklch(0.78_0.19_155)] shadow-[0_0_4px_oklch(0.78_0.19_155_/_0.6)]"
                        : isCurrent
                          ? "bg-[oklch(0.85_0.2_196)] shadow-[0_0_6px_oklch(0.85_0.2_196_/_0.8)] animate-pulse"
                          : "bg-[oklch(0.2_0.04_220)]"
                    }`}
                  />
                  <span
                    className={`font-mono text-[9px] tracking-[0.1em] uppercase ${
                      isCurrent
                        ? "text-[oklch(0.85_0.2_196)]"
                        : isDone
                          ? "text-[oklch(0.5_0.06_220)]"
                          : "text-[oklch(0.3_0.04_220)]"
                    }`}
                  >
                    {step.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="p-4 border-t border-[oklch(0.12_0.03_230)]">
            <div className="font-mono text-[9px] tracking-[0.15em] text-[oklch(0.35_0.05_220)] uppercase mb-2">
              Progress
            </div>
            <div className="h-1 bg-[oklch(0.1_0.02_240)] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[oklch(0.85_0.2_196)] shadow-[0_0_6px_oklch(0.85_0.2_196_/_0.8)] rounded-full"
                animate={{
                  width: `${Math.round(((botStepProgress + 1) / Object.values(BotStep).length) * 100)}%`,
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <div className="font-mono text-[9px] text-[oklch(0.85_0.2_196)] mt-1.5">
              {Math.round(
                ((botStepProgress + 1) / Object.values(BotStep).length) * 100,
              )}
              % COMPLETE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
