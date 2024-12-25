import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import prisma from "../utils/db";
import { requireUser } from "../utils/hooks";
import { formatCurrency } from "../utils/formatCurrency";

async function getData(userId: string) {
  const [data, paidInvoices, pendingInvoices] = await Promise.all([
    prisma.invoice.findMany({
      where: {
        userId,
      },
      select: {
        total: true,
        currency: true,
      },
    }),
    prisma.invoice.findMany({
      where: {
        userId,
        status: "PAID",
      },
      select: {
        id: true,
      },
    }),
    prisma.invoice.findMany({
      where: {
        userId,
        status: "PENDING",
      },
      select: {
        id: true,
      },
    }),
  ]);

  return {
    data,
    paidInvoices,
    pendingInvoices,
  };
}

export default async function DashboardBlocks() {
  const session = await requireUser();
  const { data, pendingInvoices, paidInvoices } = await getData(
    session.user?.id as string
  );

  const total = data.reduce((acc, invoice) => acc + invoice.total, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-8 lg:gap-10">
      {/**Revenue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-bold">
            {formatCurrency({
              amount: total,
              currency: "USD",
            })}
          </h2>
          <p className="text-sm text-muted-foreground">Based on total valume</p>
        </CardContent>
      </Card>

      {/**Total */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <Users className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-bold">+{data.length}</h2>
          <p className="text-sm text-muted-foreground">
            Total invoices issued!
          </p>
        </CardContent>
      </Card>

      {/**Paid Invoices */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
          <CreditCard className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-bold">+{paidInvoices.length}</h2>
          <p className="text-sm text-muted-foreground">
            Invoices which have been paid!
          </p>
        </CardContent>
      </Card>
      {/**Pending Invoices */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Pending Invoices
          </CardTitle>
          <Activity className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <h2 className="text-2xl font-bold">+{pendingInvoices.length}</h2>
          <p className="text-sm text-muted-foreground">
            Invoices which are currently pending!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
