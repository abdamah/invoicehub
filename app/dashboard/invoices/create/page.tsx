import CreateInvoice from "@/app/components/CreateInvoice";
import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";

async function getUserData(id: string) {
  const data = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      firstName: true,
      lastName: true,
      address: true,
      email: true,
    },
  });

  return data;
}
export default async function InvoiceCreateRoute() {
  const session = await requireUser();
  const data = await getUserData(session.user?.id as string);

  return <CreateInvoice data={data} />;
}
