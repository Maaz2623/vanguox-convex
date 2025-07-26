"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useEffect, useRef } from "react";
import { toUIMessages, useThreadMessages } from "@convex-dev/agent/react";
import { api } from "../../../../convex/_generated/api";
import { MessageCard } from "./message-card";

interface Props {
  chatId: string;
}

export const MessagesList = ({ chatId }: Props) => {
  const [mounted, setMounted] = React.useState(false);

  const { results: messages } = useThreadMessages(
    api.chat.streaming.listMessages,
    {
      threadId: chatId,
    },
    {
      initialNumItems: 100,
      stream: true,
    }
  );

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const bottomRef = useRef<HTMLDivElement>(null);

  const uiMessages = toUIMessages(messages);

  const lastMessage = uiMessages[uiMessages.length - 1];
  const isLastMessageUser = lastMessage?.role === "user";

  const lastIndex = uiMessages.length - 1;

  const streamingMessage =
    uiMessages[lastIndex]?.role === "assistant" &&
    uiMessages[lastIndex].status === "streaming"
      ? uiMessages[lastIndex]
      : null;

  const stableMessages = streamingMessage
    ? uiMessages.slice(0, -1)
    : uiMessages;

  useEffect(() => {
    if (isLastMessageUser) {
      const frame = requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      });

      return () => cancelAnimationFrame(frame);
    }

    if (!uiMessages || uiMessages.length === 0) return;
  }, [uiMessages.length, uiMessages, isLastMessageUser]);

  if (!mounted) return null; // or show a loading skeleton or fallback

  return (
    <ScrollArea className="h-full relative">
      <div className="h-6 bg-gradient-to-t via-white/20 dark:via-neutral-900/20 from-transparent dark:to-neutral-900 to-white absolute top-0 left-0 w-full z-10" />

      {/* <div className="h-8 bg-gradient-to-b from-transparent to-white absolute bottom-0 left-0 w-full z-10" /> */}
      <div className="md:w-3/4 w-full px-2 mx-auto flex flex-col gap-y-14 pb-[20%] pt-10">
        {stableMessages.map((msg) => (
          <MessageCard message={msg} key={msg.id} />
        ))}
        {isLastMessageUser && (
          <div className="flex items-center justify-center size-10 mt-10 m-2">
            Loading...
          </div>
        )}
        {streamingMessage && (
          <div>
            <MessageCard message={streamingMessage} />
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
};
