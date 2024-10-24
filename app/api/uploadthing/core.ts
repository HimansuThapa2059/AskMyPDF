import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

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

      return { fileId: newDbFile.id };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
