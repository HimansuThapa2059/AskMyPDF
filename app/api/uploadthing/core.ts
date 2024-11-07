import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { pc } from "@/lib/pinecone";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async () => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();

      if (!user || !user.id) throw new UploadThingError("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const newDbFile = await prisma.file.create({
        data: {
          name: file.name,
          key: file.key,
          userId: metadata.userId,
          // url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
          url: file.url,
          uploadStatus: "PROCESSING",
        },
      });

      try {
        const response = await fetch(file.url);

        const blob = await response.blob();
        const loader = new PDFLoader(blob);

        const pagelevelDocs = await loader.load();
        const pageAmt = pagelevelDocs.length;

        //vectorize and index the document
        const pineconeIndex = pc.Index("askmypdf");

        const embeddings = new GoogleGenerativeAIEmbeddings({
          apiKey: process.env.GEMINI_API_KEY,
          model: "text-embedding-004",
        });

        await PineconeStore.fromDocuments(pagelevelDocs, embeddings, {
          //@ts-ignore
          pineconeIndex,
          namespace: newDbFile.id,
        });

        await prisma.file.update({
          data: { uploadStatus: "SUCCESS" },
          where: {
            id: newDbFile.id,
          },
        });
      } catch (error) {
        console.log("error in core.ts" + error);
        await prisma.file.update({
          data: { uploadStatus: "FAILED" },
          where: {
            id: newDbFile.id,
          },
        });
      }

      return { fileId: newDbFile.id };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
