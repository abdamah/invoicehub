import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import LineGraph, { BarGrap } from "./Graph";
import prisma from "../utils/db";
import { requireUser } from "../utils/hooks";

async function getInvoices(userId: string) {
  const rawData = await prisma.invoice.findMany({
    where: {
      userId,
      status: "PAID",
      createdAt: {
        lte: new Date(),
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
    select: {
      createdAt: true,
      total: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  //Group and aggregate data by date
  const aggregatedData = rawData.reduce(
    (acc: { [key: string]: number }, curr) => {
      const date = new Date(curr.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      acc[date] = (acc[date] || 0) + curr.total;

      return acc;
    },
    {}
  );

  // Convert to array and from object
  const transformedData = Object.entries(aggregatedData)
    .map(([date, amount]) => ({
      date,
      amount,
      originalDate: new Date(date + ", " + new Date().getFullYear()),
    }))
    .sort((a, b) => a.originalDate.getTime() - b.originalDate.getTime())
    .map(({ date, amount }) => ({ date, amount }));

  return transformedData;
}

export default async function InvoiceGrap() {
  const session = await requireUser();
  const data = await getInvoices(session.user?.id as string);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paid Invoices</CardTitle>
        <CardDescription>
          Invoice which have been pain in the last 30 days.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 ">
        <div className="border-b">
          <LineGraph data={data} />
        </div>
        <BarGrap data={data} />
      </CardContent>
    </Card>
  );
}
