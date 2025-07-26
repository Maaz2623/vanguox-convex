import { DefaultMarkdown } from "@/components/markdown/default-markdown";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { CopyIcon, Share2Icon } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import React from "react";
import { toUIMessages } from "@convex-dev/agent/react";

interface Props {
  message: ReturnType<typeof toUIMessages>[number];
}

export const MessageCard = ({ message }: Props) => {
  return (
    <div className="">
      {message.role === "assistant" ? (
        <div className="flex justify-start items-center">
          <AssistantMessage message={message} />
        </div>
      ) : (
        <div className="flex justify-end items-center">
          <UserMessage message={message} />
        </div>
      )}
    </div>
  );
};

const UserMessage = ({ message }: Props) => {
  return (
    <AnimatePresence mode="wait" initial={true}>
      <div className="w-full flex justify-end text-[14px] md:text-[16px]  pr-4">
        <Card className="shadow-none w-fit max-w-[60%] py-2 px-4 rounded-md! bg-primary text-white dark:text-neutral-950">
          {message.content}
        </Card>
      </div>
    </AnimatePresence>
  );
};

const AssistantMessage = React.memo(({ message }: Props) => {
  const { theme } = useTheme();

  const createdAt = message.createdAt ? new Date(message.createdAt) : undefined;

  return (
    <div
      className={cn(
        "flex flex-col group px-2 pb-4 max-w-[90%] text-[14px] md:text-[16px]"
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <Image
          src={`/logo.svg`}
          alt="vibe"
          width={15}
          height={15}
          className="shrink-0"
        />
        <span className="text-xs md:text-sm font-medium">Vanguox</span>
        <span className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 font-medium">
          {createdAt && format(createdAt, "HH:mm 'on' MM dd, yyyy")}
        </span>
      </div>

      <div className="w-full flex justify-start flex-col gap-y-2">
        <div
          className={cn(
            "shadow-none text-[14px] md:text-[16px]  bg-transparent dark:bg-neutral-900 w-full p-5 border-none animate-fade-in max-w-full"
          )}
        >
          {/* <DefaultMarkdown key={messageId} id={messageId} parts={parts} /> */}
          {message.parts.map((part, idx) => {
            if (part.type === "text") {
              return (
                <DefaultMarkdown
                  isStreaming={message.status === "streaming"}
                  key={idx}
                  id={idx.toString()}
                  parts={message.parts}
                />
              );
            }

            return null; // handle other types if needed
          })}

          <div
            className={cn(
              "h-7 -ml-2 gap-x-1 text-neutral-700 dark:text-neutral-300 flex opacity-0 justify-start items-center transition-all duration-300",
              message.status === "success" && "opacity-100"
            )}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={`ghost`}
                  size={`icon`}
                  className="cursor-pointer size-7 p-0! rounded-[10px]!"
                >
                  <CopyIcon className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy text</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={`ghost`}
                  size={`icon`}
                  className="cursor-pointer size-7 rounded-[10px]!"
                >
                  <Share2Icon className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share link</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
});

AssistantMessage.displayName = "AssistantMessage";
