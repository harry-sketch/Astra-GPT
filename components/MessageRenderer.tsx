import type { UIMessage } from "ai";
import { Fragment } from "react/jsx-runtime";
import { ConversationScrollButton } from "./ai-elements/conversation";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "./ai-elements/message";
import { CopyIcon, RefreshCcwIcon } from "lucide-react";

interface Props {
  messages: UIMessage[];
}

const MessageRenderer: React.FC<Props> = ({ messages }) => {
  return (
    <>
      {messages.map((message, messageIndex) => (
        <Fragment key={message.id}>
          {message.parts.map((part, i) => {
            switch (part.type) {
              case "text": {
                const isLastMessage = messageIndex === messages.length - 1;
                return (
                  <Fragment key={`${message.id}-${i}`}>
                    <Message from={message.role} className="text-white">
                      <MessageContent className="">
                        <MessageResponse>{part.text}</MessageResponse>
                      </MessageContent>
                    </Message>
                    {message.role === "assistant" && isLastMessage && (
                      <MessageActions>
                        <MessageAction onClick={() => {}} label="Retry">
                          <RefreshCcwIcon className="size-3" />
                        </MessageAction>
                        <MessageAction
                          onClick={() =>
                            navigator.clipboard.writeText(part.text)
                          }
                          label="Copy"
                        >
                          <CopyIcon className="size-3" />
                        </MessageAction>
                      </MessageActions>
                    )}
                  </Fragment>
                );
              }

              default:
                return null;
            }
          })}
        </Fragment>
      ))}
      <ConversationScrollButton />
    </>
  );
};

export default MessageRenderer;
