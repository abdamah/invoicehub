import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import InvoiceActoins from "./InvoiceActoins";
import prisma from "../utils/db";
import { requireUser } from "../utils/hooks";
import { formatCurrency, formatDate } from "../utils/formatCurrency";
import { Badge } from "@/components/ui/badge";
import EmptyState from "./EmptyState";

async function getData(userId: string) {
  const data = await prisma.invoice.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      invoiceNumber: true,
      invoiceName: true,
      clientName: true,
      total: true,
      status: true,
      createdAt: true,
      date: true,
      currency: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
}

export default async function InvoiceList() {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);

  if (!data.length)
    return (
      <EmptyState
        title="No invoices found"
        href="/dashboard/invoices/create"
        buttonText="Create Invoice"
        description="Create an invoice to see it right here."
        hideLink={false}
      />
    );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>#{invoice.invoiceNumber}</TableCell>
            <TableCell>{invoice.clientName}</TableCell>
            <TableCell>
              {formatCurrency({
                amount: invoice.total,
                currency: invoice.currency.toString(),
              })}
            </TableCell>

            <TableCell>
              <Badge
                className={invoice.status === "PAID" ? "bg-green-500" : ""}
              >
                {invoice.status}
              </Badge>
            </TableCell>
            <TableCell>{formatDate(invoice.createdAt)}</TableCell>

            <TableCell className="text-right">
              <InvoiceActoins id={invoice.id} status={invoice.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
