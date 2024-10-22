import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import Dashboard from '@/components/Dashboard';

const page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) redirect('/auth-callback?origin=dashboard');

  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) {
    redirect('/auth-callback?origin=dashboard');
  }

  return <Dashboard />;
};

export default page;
