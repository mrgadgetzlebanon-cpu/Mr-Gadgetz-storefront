import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ExtendedProduct } from "@/hooks/use-products";
import type { ProductWithVariants } from "@/hooks/use-product-variant";

interface ProductAIChatProps {
  product: (ExtendedProduct & ProductWithVariants) | ExtendedProduct;
}

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const MODEL = "gemini-2.5-flash-lite";

export function ProductAIChat({ product }: ProductAIChatProps) {
  const apiKey = useMemo(
    () =>
      import.meta.env.VITE_GOOGLE_AI_KEY ||
      (typeof process !== "undefined"
        ? (process as any).env?.VITE_GOOGLE_AI_KEY
        : undefined),
    [],
  );
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const disabled = !apiKey;

  const systemPrompt = useMemo(() => {
    return [
      "You are a helpful sales assistant for an electronics store.",
      "The user is looking at this product:",
      `Title: ${product.name}`,
      `Vendor: ${product.brand || "Unknown"}`,
      `Description: ${product.description || "No description provided."}`,
      "Answer the user's question based on this information. Be concise and friendly.",
      "User Question: {{question}}",
    ].join("\n");
  }, [product]);

  const handleSend = async () => {
    if (!apiKey) {
      console.warn("VITE_GOOGLE_AI_KEY is missing; AI chat is disabled.");
      return;
    }
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setError(null);

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const prompt = systemPrompt.replace("{{question}}", trimmed);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }],
              },
            ],
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't generate a response.";
      setMessages((prev) => [...prev, { role: "assistant", content: text }]);
    } catch (err: any) {
      const message = err?.message || "Failed to reach AI service.";
      setError(message);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I ran into an error fetching the answer.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      {!disabled ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          data-testid="button-ask-ai"
          className="
            relative overflow-hidden z-10 w-full rounded-full h-12 text-sm font-medium transition-all duration-500 ease-in-out
            bg-[#0c57ef] text-white border border-[#0c57ef]
            shadow-[0_4px_15px_rgba(12,87,239,0.3)]
            hover:shadow-[0_4px_20px_rgba(72,191,239,0.4)]
            hover:text-[#0c57ef]

            before:content-[''] before:absolute before:z-[-1] before:block
            before:w-[150%] before:h-0 before:rounded-[50%]
            before:left-1/2 before:top-[100%]
            before:translate-x-[-50%] before:translate-y-[-50%]
            before:bg-white before:transition-all before:duration-500

            hover:before:h-[300%] hover:before:top-1/2
          "
        >
          ✨ Ask AI about this product
        </button>
      ) : null}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Sales Assistant</DialogTitle>
            <DialogDescription className="sr-only">
              Ask questions about this product and get quick answers.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            <ScrollArea className="h-64 rounded-md border p-3 bg-muted/50">
              <div className="flex flex-col gap-3">
                {messages.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Ask anything about this product.
                  </p>
                )}
                {messages.map((m, idx) => (
                  <div
                    key={`${m.role}-${idx}`}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                        m.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="text-sm text-muted-foreground">
                    AI is thinking...
                  </div>
                )}
                {error && (
                  <div className="text-sm text-destructive">{error}</div>
                )}
              </div>
            </ScrollArea>

            <div className="flex items-center gap-2">
              <Input
                placeholder="Ask a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
              >
                Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
