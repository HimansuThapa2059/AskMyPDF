"use client";
import { useToast } from "@/hooks/use-toast";
import React, { createContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface ChatContextType {
  addMessage: () => void;
  message: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
}

interface ChatContextProviderType {
  fileId: string;
  children: React.ReactNode;
}

export const ChatContext = createContext<ChatContextType>({
  addMessage: () => {},
  message: "",
  handleInputChange: () => {},
  isLoading: false,
});

export const ChatContextProvider = ({
  fileId,
  children,
}: ChatContextProviderType) => {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { toast } = useToast();

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      try {
        const response = await axios.post("/api/message", {
          fileId,
          message,
        });

        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "Something went wrong",
        );
      }
    },
  });

  const addMessage = () => sendMessage({ message });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <ChatContext.Provider
      value={{ addMessage, message, handleInputChange, isLoading }}
    >
      {children}
    </ChatContext.Provider>
  );
};
