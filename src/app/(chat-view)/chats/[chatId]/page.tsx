import { ChatView } from "@/modules/chat/views/chat-view";
import React from "react";

interface Props {
  params: Promise<{
    chatId: string;
  }>;
}

const ChatViewPage = async ({ params }: Props) => {
  const { chatId } = await params;

  return <ChatView chatId={chatId} />;
};

export default ChatViewPage;
