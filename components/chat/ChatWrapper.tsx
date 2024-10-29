"use client";
import React, { useCallback, useEffect, useState } from "react";
import Messages from "./Messages";
import ChatInput from "./ChatInput";
import axios from "axios";
import { Loader2, MoveLeft, XCircle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

interface UploadStatus {
  status: "PROCESSING" | "SUCCESS" | "FAILED";
}

const ChatWrapper = ({ fileId }: { fileId: string }) => {
  const [data, setData] = useState<UploadStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getFileUploadStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/files/${fileId}`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching file upload status:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fileId]);

  useEffect(() => {
    const fetchStatus = () => {
      getFileUploadStatus();
    };

    fetchStatus();

    const intervalId = setInterval(() => {
      if (data?.status !== "SUCCESS" && data?.status !== "FAILED") {
        fetchStatus();
      } else {
        clearInterval(intervalId);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [data?.status, getFileUploadStatus]);

  if (isLoading) {
    return (
      <div className="relative flex min-h-full flex-col justify-between gap-2 divide-y divide-zinc-200 bg-zinc-50">
        <div className="mb-28 flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            <h3 className="text-xl font-semibold">Loading...</h3>
            <p className="text-sm text-zinc-500">
              We&apos;re preparing your PDF.
            </p>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    );
  }

  if (data?.status === "PROCESSING") {
    return (
      <div className="relative flex min-h-full flex-col justify-between gap-2 divide-y divide-zinc-200 bg-zinc-50">
        <div className="mb-28 flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            <h3 className="text-xl font-semibold">Processing...</h3>
            <p className="text-sm text-zinc-500">
              This won&apos;t take too long.
            </p>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    );
  }

  if (data?.status === "FAILED") {
    return (
      <div className="relative flex min-h-full flex-col justify-between gap-2 divide-y divide-zinc-200 bg-zinc-50">
        <div className="mb-28 flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <XCircle className="h-8 w-8 text-rose-500" />
            <h3 className="text-xl font-semibold">Too many pages in the pdf</h3>
            <p className="text-sm text-zinc-500">
              Your <span className="font-medium text-indigo-900">Free</span>{" "}
              plan supports upto 5 pages per pdf.
            </p>
            <Link
              href={"/dashboard"}
              className={buttonVariants({
                variant: "secondary",
                className:
                  "mt-4 border border-slate-200 bg-indigo-400 hover:bg-indigo-400/90",
              })}
            >
              <MoveLeft className="mr-1.5 h-3 w-3" />
              Back
            </Link>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-full flex-col justify-between gap-2 divide-y divide-zinc-200 bg-zinc-50">
      <div className="mb-28 flex flex-1 flex-col items-center justify-center">
        <Messages />
      </div>

      <ChatInput />
    </div>
  );
};

export default ChatWrapper;
