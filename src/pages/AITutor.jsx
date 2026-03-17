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
import { api } from "@/lib/api";

const suggestedTopics = [
  "What is discrete trial training?",
  "Explain positive reinforcement",
  "Tips for the RBT exam",
  "What is a functional behavior assessment?",
];

export default function AITutor() {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingConvos, setLoadingConvos] = useState(true);
  const messagesEndRef = useRef(null);

  const activeConversation = useMemo(
    () =>
      conversations.find((conversation) => conversation.id === activeConversationId) ||
      null,
    [activeConversationId, conversations],
  );

  const messages = activeConversation?.messages || [];

  useEffect(() => {
    let cancelled = false;

    api
      .listTutorConversations()
      .then((items) => {
        if (cancelled) {
          return;
        }

        const nextConversations = Array.isArray(items) ? items : [];
        setConversations(nextConversations);
        setActiveConversationId(nextConversations[0]?.id || null);
        setLoadingConvos(false);
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setConversations([]);
        setActiveConversationId(null);
        setLoadingConvos(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleNewConversation = async () => {
    const conversation = await api.createTutorConversation({ name: "New Chat" });
    setConversations((current) => [conversation, ...current]);
    setActiveConversationId(conversation.id);
    setInput("");
  };

  const handleSelectConversation = (conversationId) => {
    setActiveConversationId(conversationId);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) {
      return;
    }

    let conversationId = activeConversationId;
    if (!conversationId) {
      const conversation = await api.createTutorConversation({
        name: text.slice(0, 50),
      });
      setConversations((current) => [conversation, ...current]);
      setActiveConversationId(conversation.id);
      conversationId = conversation.id;
    }

    setInput("");
    setLoading(true);

    try {
      const updatedConversation = await api.sendTutorMessage(conversationId, {
        content: text,
      });

      setConversations((current) => {
        const exists = current.some((conversation) => conversation.id === updatedConversation.id);

        if (!exists) {
          return [updatedConversation, ...current];
        }

        return current.map((conversation) =>
          conversation.id === updatedConversation.id ? updatedConversation : conversation,
        );
      });
    } finally {
      setLoading(false);
    }
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
                  Hello! I&apos;m your AI Tutor
                </h3>
                <p className="mt-1 max-w-sm text-sm text-slate-400">
                  Ask me anything about ABA concepts, RBT exam prep, or study
                  strategies.
                </p>

                <div className="mt-6 grid max-w-md grid-cols-2 gap-2">
                  {suggestedTopics.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => setInput(topic)}
                      className="rounded-xl border border-slate-200 p-3 text-left text-xs text-slate-600 transition-all hover:border-[#1E5EFF]/30 hover:bg-[#1E5EFF]/5"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))
            )}

            {loading ? (
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
