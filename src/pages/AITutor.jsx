import { useEffect, useMemo, useRef, useState } from "react";
import {
  Brain,
  Loader2,
  MessageSquare,
  Plus,
  Send,
  Sparkles,
} from "lucide-react";
import MessageBubble from "@/components/chat/MessageBubble";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STORAGE_KEY = "rbt_genius_ai_tutor_conversations";
const ACTIVE_STORAGE_KEY = "rbt_genius_ai_tutor_active";

const suggestedTopics = [
  "What is discrete trial training?",
  "Explain positive reinforcement",
  "Tips for the RBT exam",
  "What is a functional behavior assessment?",
];

function createId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function createConversation(name = "New Chat") {
  return {
    id: createId("convo"),
    metadata: { name },
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function readStoredConversations() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistConversations(conversations) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}

function persistActiveConversation(activeId) {
  if (typeof window === "undefined") {
    return;
  }

  if (activeId) {
    window.localStorage.setItem(ACTIVE_STORAGE_KEY, activeId);
    return;
  }

  window.localStorage.removeItem(ACTIVE_STORAGE_KEY);
}

function getStoredActiveConversationId() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(ACTIVE_STORAGE_KEY);
}

function createTutorReply(text) {
  const normalized = text.toLowerCase();

  if (normalized.includes("discrete trial")) {
    return {
      role: "assistant",
      content:
        "Discrete trial training is a structured teaching method with a clear instruction, learner response, and consequence. It works well for breaking skills into smaller teachable parts.",
    };
  }

  if (normalized.includes("positive reinforcement")) {
    return {
      role: "assistant",
      content:
        "Positive reinforcement means adding something valuable right after a behavior so that behavior is more likely to happen again. A simple example is praising a learner immediately after a correct response.",
    };
  }

  if (normalized.includes("functional behavior assessment")) {
    return {
      role: "assistant",
      content:
        "A functional behavior assessment helps identify why a behavior happens by looking at antecedents, behavior, and consequences. The goal is to understand function before choosing an intervention.",
    };
  }

  if (
    normalized.includes("rbt exam") ||
    normalized.includes("exam tips") ||
    normalized.includes("study")
  ) {
    return {
      role: "assistant",
      content:
        "A strong RBT study session usually combines short concept review, practice questions, and explanation of missed answers. Focus on reinforcement, prompting, data collection, ethics, and behavior reduction vocabulary.",
    };
  }

  return {
    role: "assistant",
    content:
      "This AI Tutor page is set up as a local boilerplate for now. We can connect it later to a real AI endpoint, but the UI, conversation flow, and history handling are already in place.",
  };
}

export default function AITutor() {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingConvos, setLoadingConvos] = useState(true);
  const messagesEndRef = useRef(null);
  const replyTimeoutRef = useRef(null);

  const activeConversation = useMemo(
    () =>
      conversations.find((conversation) => conversation.id === activeConversationId) ||
      null,
    [activeConversationId, conversations],
  );

  const messages = activeConversation?.messages || [];

  useEffect(() => {
    const storedConversations = readStoredConversations();
    const storedActiveId = getStoredActiveConversationId();

    setConversations(storedConversations);
    setActiveConversationId(
      storedConversations.some((conversation) => conversation.id === storedActiveId)
        ? storedActiveId
        : storedConversations[0]?.id || null,
    );
    setLoadingConvos(false);
  }, []);

  useEffect(() => {
    if (loadingConvos) {
      return;
    }

    persistConversations(conversations);
  }, [conversations, loadingConvos]);

  useEffect(() => {
    if (loadingConvos) {
      return;
    }

    persistActiveConversation(activeConversationId);
  }, [activeConversationId, loadingConvos]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    return () => {
      if (replyTimeoutRef.current) {
        clearTimeout(replyTimeoutRef.current);
      }
    };
  }, []);

  const updateConversation = (conversationId, updater) => {
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId ? updater(conversation) : conversation,
      ),
    );
  };

  const handleNewConversation = () => {
    const conversation = createConversation();
    setConversations((current) => [conversation, ...current]);
    setActiveConversationId(conversation.id);
    setInput("");
  };

  const handleSelectConversation = (conversationId) => {
    setActiveConversationId(conversationId);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text || loading) {
      return;
    }

    let conversationId = activeConversationId;

    if (!conversationId) {
      const conversation = createConversation(text.slice(0, 50));
      setConversations((current) => [conversation, ...current]);
      setActiveConversationId(conversation.id);
      conversationId = conversation.id;
    }

    const userMessage = {
      id: createId("msg"),
      role: "user",
      content: text,
    };

    setInput("");
    setLoading(true);

    updateConversation(conversationId, (conversation) => ({
      ...conversation,
      metadata: {
        ...conversation.metadata,
        name:
          conversation.metadata?.name === "New Chat" || !conversation.metadata?.name
            ? text.slice(0, 50)
            : conversation.metadata.name,
      },
      messages: [...(conversation.messages || []), userMessage],
      updatedAt: new Date().toISOString(),
    }));

    if (replyTimeoutRef.current) {
      clearTimeout(replyTimeoutRef.current);
    }

    replyTimeoutRef.current = setTimeout(() => {
      const assistantMessage = {
        id: createId("msg"),
        ...createTutorReply(text),
      };

      updateConversation(conversationId, (conversation) => ({
        ...conversation,
        messages: [...(conversation.messages || []), assistantMessage],
        updatedAt: new Date().toISOString(),
      }));
      setLoading(false);
    }, 700);
  };

  return (
    <div className="mx-auto h-[calc(100vh-8rem)] max-w-7xl">
      <div className="flex h-full gap-4">
        <div className="flex w-72 flex-shrink-0 flex-col rounded-2xl border border-slate-100 bg-white">
          <div className="border-b border-slate-100 p-4">
            <Button
              onClick={handleNewConversation}
              className="w-full gap-2 rounded-xl bg-[#1E5EFF] hover:bg-[#1E5EFF]/90"
            >
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </div>

          <div className="flex-1 space-y-1 overflow-y-auto p-2">
            {loadingConvos ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
              </div>
            ) : conversations.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-400">
                No conversations yet
              </p>
            ) : (
              conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => handleSelectConversation(conversation.id)}
                  className={`w-full rounded-xl px-3 py-2.5 text-left text-sm transition-all ${
                    activeConversationId === conversation.id
                      ? "bg-[#1E5EFF]/5 font-medium text-[#1E5EFF]"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">
                      {conversation.metadata?.name || "Chat"}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col rounded-2xl border border-slate-100 bg-white">
          <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E5EFF] to-[#6366F1]">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Genius AI Tutor
              </h2>
              <p className="text-[11px] text-slate-400">
                Your personal ABA and RBT exam coach
              </p>
            </div>
            <Sparkles className="ml-1 h-4 w-4 text-[#FFB800]" />
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1E5EFF]/10 to-violet-100">
                  <Brain className="h-8 w-8 text-[#1E5EFF]" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Hello! I'm your AI Tutor
                </h3>
                <p className="mt-1 max-w-sm text-sm text-slate-400">
                  Ask me about ABA concepts, RBT exam prep, or study strategies.
                </p>

                <div className="mt-6 grid max-w-md grid-cols-2 gap-2">
                  {suggestedTopics.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => setInput(topic)}
                      className="rounded-xl border border-slate-200 p-3 text-left text-xs text-slate-600 transition-all hover:border-[#1E5EFF]/30 hover:bg-[#1E5EFF]/[0.03]"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <MessageBubble
                    key={message.id || `${message.role}-${index}`}
                    message={message}
                  />
                ))}
                {loading ? (
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Thinking...
                  </div>
                ) : null}
              </>
            )}
            {messages.length === 0 && loading ? (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Thinking...
              </div>
            ) : null}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-slate-100 p-4">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about ABA concepts, exam tips..."
                className="flex-1 rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-[#1E5EFF]/20"
              />
              <Button
                type="submit"
                disabled={!input.trim() || loading}
                className="rounded-xl bg-[#1E5EFF] px-4 hover:bg-[#1E5EFF]/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
