"use client";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { ArrowUpIcon, PaperclipIcon } from "lucide-react";
import React, { useState } from "react";
import TextAreaAutoSize from "react-textarea-autosize";
import { api } from "../../../../convex/_generated/api";
import { optimisticallySendMessage } from "@convex-dev/agent/react";

interface Props {
  chatId: string;
}

export const MessageForm = ({ chatId }: Props) => {
  const [input, setInput] = useState("");

  const sendMessage = useMutation(
    api.chat.streaming.initiateAsyncStreaming
  ).withOptimisticUpdate(
    optimisticallySendMessage(api.chat.streaming.listMessages)
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage({
      threadId: chatId,
      prompt: input,
    }).then(() => setInput(""));
  };

  return (
    <>
      <div className="md:w-3/4 w-[95%] mx-auto flex flex-col justify-center items-end">
        <div className="" />
        <div className="w-full mx-auto rounded-md shadow-md">
          <div className="rounded-lg mx-auto dark:bg-neutral-800 border dark:border-neutral-700 border-neutral-200 bg-white overflow-hidden p-2">
            <form className="" onSubmit={onSubmit}>
              <div className="flex">
                <TextAreaAutoSize
                  rows={1}
                  maxRows={3}
                  autoFocus={true}
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                  className="px-3 py-3 resize-none text-sm border-none w-full outline-none bg-transparent"
                  placeholder="What would you like to build?"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (e.shiftKey) return; // Allow newline
                      e.preventDefault();
                      if (e.ctrlKey || !e.metaKey) {
                        onSubmit(e);
                      }
                    }
                  }}
                />
              </div>
              <div className="h-8 flex justify-between items-center">
                <div className="w-fit">
                  <Button
                    variant={`ghost`}
                    size={`icon`}
                    type="button"
                    className="h-8 shadow-none w-8"
                  >
                    <PaperclipIcon className="size-4" />
                  </Button>
                </div>
                <Button
                  size="icon"
                  type={`submit`}
                  className="h-8 shadow-none w-8"
                >
                  <ArrowUpIcon className="size-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
