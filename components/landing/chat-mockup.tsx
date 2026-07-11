import Image from "next/image"

interface ChatMessage {
  from: "tourist" | "concierge"
  text: string
}

interface ChatMockupProps {
  chat: {
    aria: string
    status: string
    messages: ChatMessage[]
  }
}

export function ChatMockup({ chat }: ChatMockupProps) {
  const lastIndex = chat.messages.length - 1

  return (
    <div
      role="img"
      aria-label={chat.aria}
      data-reveal
      className="cg-chat cg-reveal cg-float relative mx-auto w-full max-w-sm"
    >
      {/* Decorative glow behind the panel */}
      <div
        aria-hidden="true"
        className="absolute -inset-8 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 60% 40%, rgba(212,165,116,.18), transparent 65%)",
        }}
      />

      <div className="cg-gradient-border-glass rounded-3xl p-4 sm:p-5 shadow-2xl">
        <div aria-hidden="true">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border/60 pb-3 mb-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
              <Image
                src="/concierge-icon-sand.svg"
                width={26}
                height={32}
                alt=""
              />
            </div>
            <div className="text-left">
              <p className="font-display font-semibold text-foreground">
                Concierge
              </p>
              <p className="text-xs text-muted-foreground">
                <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                {chat.status}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex flex-col gap-2.5 text-left">
            {chat.messages.map((message, i) => {
              const bubbleDelay = 0.4 + i * 1.4
              const typingDelay = bubbleDelay - 1.4
              const isLast = i === lastIndex

              return (
                <div key={i} className="relative flex flex-col gap-2.5">
                  {message.from === "concierge" && (
                    <div
                      className="cg-typing-row absolute left-0 top-0 rounded-2xl rounded-bl-sm bg-secondary/70 px-3.5 py-2.5"
                      style={{ "--d": `${typingDelay}s` } as React.CSSProperties}
                    >
                      <span
                        className="mx-0.5 inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground cg-typing-dot"
                        style={{ "--td": "0s" } as React.CSSProperties}
                      />
                      <span
                        className="mx-0.5 inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground cg-typing-dot"
                        style={{ "--td": ".15s" } as React.CSSProperties}
                      />
                      <span
                        className="mx-0.5 inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground cg-typing-dot"
                        style={{ "--td": ".3s" } as React.CSSProperties}
                      />
                    </div>
                  )}

                  {message.from === "tourist" ? (
                    <div
                      className="cg-bubble self-end max-w-[85%] rounded-2xl rounded-br-sm bg-accent/15 border border-accent/25 px-3.5 py-2.5 text-sm text-foreground"
                      style={{ "--d": `${bubbleDelay}s` } as React.CSSProperties}
                    >
                      {message.text}
                    </div>
                  ) : (
                    <div
                      className="cg-bubble self-start max-w-[85%] rounded-2xl rounded-bl-sm bg-secondary/70 px-3.5 py-2.5 text-sm text-foreground"
                      style={{ "--d": `${bubbleDelay}s` } as React.CSSProperties}
                    >
                      {message.text}
                      <span
                        className={`cg-tick ml-1.5 inline-block text-[10px] ${isLast ? "cg-tick-final" : ""}`}
                        style={
                          isLast
                            ? ({ "--d": `${bubbleDelay + 0.6}s` } as React.CSSProperties)
                            : undefined
                        }
                      >
                        ✓✓
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
