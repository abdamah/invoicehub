import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import DashboardBlocks from "../components/DashboardBlocks";
import EmptyState from "../components/EmptyState";
import InvoiceGrap from "../components/InvoiceGrap";
import RecentInvoices from "../components/RecentInvoices";
import prisma from "../utils/db";
import { requireUser } from "../utils/hooks";

async function getData(userId: string) {
  const data = await prisma.invoice.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
    },
  });

  return data;
}

export default async function DashboardRoute() {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);
  if (!data.length)
    return (
      <EmptyState
        title="No invoices found"
        href="/dashboard/invoices/create"
        buttonText="Create Invoice"
        description="Create an invoice to see it right here!"
      />
    );

  return (
    <Suspense fallback={<Skeleton className="w-full h-full flex-1" />}>
      <DashboardBlocks />
      <div className="grid gap-2 lg:grid-cols-12 md:gap-4 mt-2">
        <div className="lg:col-span-7">
          <InvoiceGrap />
        </div>
        <div className="lg:col-span-5">
          <RecentInvoices />
        </div>
      </div>
    </Suspense>
  );
}
