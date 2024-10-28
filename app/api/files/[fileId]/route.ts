import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

export async function DELETE(
  req: Request,
  { params }: { params: { fileId: string } },
) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    const { fileId } = params;

    if (!user || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const file = await prisma.file.findFirst({
      where: {
        id: fileId,
        userId: user.id,
      },
    });

    if (!file) return new NextResponse("not-found", { status: 404 });

    // delete pdf from mongoDb
    const { key } = await prisma.file.delete({
      where: {
        id: fileId,
        userId: user.id,
      },
    });

    // delete pdf from uploadthing
    const utapi = new UTApi();
    await utapi.deleteFiles(key);

    return NextResponse.json(file);
  } catch (err: any) {
    console.log("[deleting-files]", err);
    throw new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { fileId: string } },
) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    const { fileId } = params;

    if (!user || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const file = await prisma.file.findFirst({
      where: {
        id: fileId,
        userId: user.id,
      },
    });

    if (!file) {
      return NextResponse.json({ status: "PENDING" as const });
    }

    return NextResponse.json({ status: file.uploadStatus });
  } catch (err: any) {
    console.log("[GET-fileStatus]", err);
    throw new NextResponse("Internal server error", { status: 500 });
  }
}
