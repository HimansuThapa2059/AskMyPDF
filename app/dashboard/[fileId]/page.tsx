import prisma from '@/lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { notFound, redirect } from 'next/navigation';
import React from 'react';

const page = async ({ params }: { params: { fileId: string } }) => {
  const { fileId } = params;
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) redirect(`/auth-callback?origin=dashboard/${fileId}`);

  const file = prisma.file.findFirst({
    where: {
      id: fileId,
      userId: user.id,
    },
  });

  if (!file) return notFound();
  return <div>fileId : {fileId}</div>;
};

export default page;
