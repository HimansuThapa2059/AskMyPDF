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

// export async function GET(
//   req: Request,
//   { params }: { params: { key: string } },
// ) {
//   try {
//     const { getUser } = getKindeServerSession();
//     const user = await getUser();

//     const { key } = params;

//     if (!key) return new NextResponse("key is missing", { status: 400 });

//     if (!user || !user.id) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     const file = await prisma.file.findFirst({
//       where: {
//         userId: user.id,
//         key,
//       },
//     });

//     if (!file) return new NextResponse("Not-found", { status: 404 });

//     return NextResponse.json(file);
//   } catch (err: any) {
//     console.log("[getting-file]", err);
//     throw new NextResponse("Internal server error", { status: 500 });
//   }
// }
