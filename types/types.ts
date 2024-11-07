import { z } from "zod";

export interface FileType {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  uploadStatus: "PENDING" | "PROCESSING" | "FAILED" | "SUCCESS";
  url: string;
  key: string;
  userId: string | null;
}

export type FileArray = FileType[];

export const sendMessageValidator = z.object({
  fileId: z.string(),
  message: z.string(),
});

export const getFIleMessages = z.object({
  limit: z.number().min(1).max(100).nullish(),
  cursor: z.string().nullish(),
  fileId: z.string(),
});
