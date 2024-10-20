import prisma from '@/lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id || !user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (dbUser) {
      return NextResponse.json(dbUser);
    }

    const newDbUser = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
      },
    });

    return NextResponse.json(newDbUser);
  } catch (err: any) {
    console.error('Error in /api/callback:', err.message);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
