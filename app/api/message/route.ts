import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { pc } from "@/lib/pinecone";
import { sendMessageValidator } from "@/types/types";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id: userId } = user;
  const { fileId, message } = sendMessageValidator.parse(body);

  const file = await prisma.file.findFirst({
    where: {
      id: fileId,
      userId: userId,
    },
  });

  if (!file) return new NextResponse("Not found", { status: 404 });

  await prisma.message.create({
    data: {
      text: message,
      isUserMessage: true,
      userId,
      fileId,
    },
  });

  // Vectorize the message
  const pineconeIndex = pc.Index("askmypdf");

  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: "text-embedding-004",
  });

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    //@ts-ignore
    pineconeIndex,
    namespace: file.id,
  });

  const results = await vectorStore.similaritySearch(message, 4);

  const prevMessages = await prisma.message.findMany({
    where: {
      fileId,
    },
    orderBy: { createdAt: "asc" },
    take: 6,
  });

  const formattedPrevMessages = prevMessages.map((mes) => ({
    role: mes.isUserMessage ? ("user" as const) : ("model" as const),
    content: mes.text,
  }));

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const chat = model.startChat({
    history: formattedPrevMessages.map((mes) => ({
      role: mes.role,
      parts: [{ text: mes.content }],
    })),
  });

  const messageToBeSentToAI = `
  CONTEXT:
  ${results.map((r) => r.pageContent).join("\n\n")}

  USER INPUT: ${message}
`;

  const messageResponse = await chat.sendMessageStream(messageToBeSentToAI);

  let accumulatedResponse: string = "";

  // Create a ReadableStream to stream chunks
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of messageResponse.stream) {
        const chunkText = chunk.text();
        accumulatedResponse += chunkText;
        controller.enqueue(new TextEncoder().encode(chunkText)); // Encode text chunk to stream
      }

      await prisma.message.create({
        data: {
          fileId,
          userId,
          text: accumulatedResponse,
          isUserMessage: false,
        },
      });

      controller.close(); // Close the stream when done
    },
  });

  return new NextResponse(stream);
}
