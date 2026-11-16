"use client";

import { useChat } from "@ai-sdk/react";
import { useStore } from "@/store/useStore";
import InputContainer from "./InputContainer";
import MessageRenderer from "./MessageRenderer";
import { Conversation, ConversationContent } from "./ai-elements/conversation";
import type { StoredMessage } from "@langchain/core/messages";
import { useEffect } from "react";
import { convertLangChainToUI } from "../lib/utils";

interface Props {
  messageHistory: StoredMessage[];
}

export const ChatInterface: React.FC<Props> = ({ messageHistory }) => {
  const { chat } = useStore();

  const { messages, setMessages } = useChat({ chat });

  useEffect(() => {
    const gg = convertLangChainToUI(messageHistory);
    setMessages(gg);
  }, [messageHistory, setMessages]);

  return (
    <>
      {messages.length > 0 || (messageHistory && messageHistory?.length > 0) ? (
        <div className="flex flex-col flex-1 h-full w-full min-h-0 overflow-hidden text-white">
          <div className="flex flex-col h-full w-full">
            <div className="flex-1 min-h-0">
              <Conversation className="h-full">
                <ConversationContent className="max-w-200 mx-auto px-4 pt-4">
                  <MessageRenderer messages={messages} />
                </ConversationContent>
              </Conversation>
            </div>

            <div>
              <InputContainer />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-1 h-full w-full min-h-0 overflow-y-scroll">
          <main className="h-full flex flex-col items-center  justify-end md:justify-center max-w-4xl mx-auto w-full px-4 -mt-20">
            <h1 className="text-3xl font-normal mb-8 tracking-tight text-white">
              What can I help with ?
            </h1>
            <InputContainer />
          </main>
        </div>
      )}
    </>
  );
};
