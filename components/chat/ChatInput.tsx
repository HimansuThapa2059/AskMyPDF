import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useContext, useRef } from "react";
import { ChatContext } from "./ChatContext";

interface ChatInputProps {
  isDisabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ isDisabled = false }) => {
  const { addMessage, handleInputChange, isLoading, message } =
    useContext(ChatContext);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="absolute bottom-0 left-0 w-full">
      <div className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex w-full flex-grow flex-col p-4">
            <div className="relative">
              <Textarea
                autoFocus
                ref={textAreaRef}
                placeholder="Enter your questions here..."
                rows={1}
                maxRows={4}
                value={message}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();

                    addMessage();
                    textAreaRef.current?.focus();
                  }
                }}
                className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch resize-none py-3 pr-12 text-base"
              />

              <Button
                aria-label="send message"
                disabled={isLoading || isDisabled}
                type="submit"
                onClick={(e) => {
                  e.preventDefault();

                  addMessage();
                  textAreaRef.current?.focus();
                }}
                className="absolute bottom-1.5 right-[8px]"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
