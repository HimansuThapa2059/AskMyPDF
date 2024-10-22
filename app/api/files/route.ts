import prisma from '@/lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user.id || !user.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const files = await prisma.file.findMany({
      where: {
        userId: user.id,
      },
    });

    return NextResponse.json(files);
  } catch (err: any) {
    console.log('[getting-files]', err);
    throw new NextResponse('Internal server error', { status: 500 });
  }
}
