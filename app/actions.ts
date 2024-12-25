"use server";
import { parseWithZod } from "@conform-to/zod";

import { redirect } from "next/navigation";
import prisma from "./utils/db";
import { formatCurrency, formatDate } from "./utils/formatCurrency";
import { requireUser } from "./utils/hooks";
import { emailClient } from "./utils/mailtrap";
import { invoiceSchema, onboardingSchema } from "./utils/zodSchemas";

export async function onboardUser(prevState: unknown, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: onboardingSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }
  await prisma.user.update({
    where: {
      id: session.user?.id,
    },
    data: {
      firstName: submission.value.firstName,
      lastName: submission.value.lastName,
      address: submission.value.address,
    },
  });

  return redirect("/dashboard");
}

export async function createInvoice(prevState: unknown, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: invoiceSchema,
  });

  if (submission.status !== "success") return submission.reply();

  const data = await prisma.invoice.create({
    data: {
      clientAddress: submission.value.clientAddress,
      clientEmail: submission.value.clientEmail,
      clientName: submission.value.clientName,

      fromAddress: submission.value.fromAddress,
      fromEmail: submission.value.fromEmail,
      fromName: submission.value.fromName,

      currency: submission.value.currency,

      date: submission.value.date,
      dueDate: submission.value.dueDate,

      invoiceItemDescription: submission.value.invoiceItemDescription,
      invoiceItemQuantity: submission.value.invoiceItemQuantity,
      invoiceItemRate: submission.value.invoiceItemRate,
      invoiceName: submission.value.invoiceName,
      invoiceNumber: submission.value.invoiceNumber,

      status: submission.value.status,
      total: submission.value.total,

      note: submission.value.note,

      userId: session.user?.id,
    },
  });

  const sender = {
    email: "hello@demomailtrap.com",
    name: "Abdallah Mahmoud",
  };
  //send email notification
  emailClient.send({
    from: sender,
    to: [{ email: "javabyabdallah@gmail.com" }],
    template_uuid: "2b10536c-cf56-4789-b11e-3dbc707f4886",
    template_variables: {
      clienName: submission.value.clientName,
      invoiceNumber: submission.value.invoiceNumber,
      invoiceDueDate: formatDate(submission.value.date),
      totalAmount: formatCurrency({
        amount: submission.value.total,
        currency: submission.value.currency,
      }),
      invoiceLink:
        process.env.NODE_ENV !== "production"
          ? `http://localhost:3000/api/invoice/${data.id}`
          : "https://invoicehub-teal.vercel.app/api/invoice/${data.id}",
    },
  });

  return redirect("/dashboard/invoices");
}

export async function editInvoice(prevState: any, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: invoiceSchema,
  });

  if (submission.status !== "success") return submission.reply();

  const data = await prisma.invoice.update({
    where: {
      id: formData.get("id") as string,
      userId: session.user?.id,
    },
    data: {
      clientAddress: submission.value.clientAddress,
      clientEmail: submission.value.clientEmail,
      clientName: submission.value.clientName,

      fromAddress: submission.value.fromAddress,
      fromEmail: submission.value.fromEmail,
      fromName: submission.value.fromName,

      currency: submission.value.currency,

      date: submission.value.date,
      dueDate: submission.value.dueDate,

      invoiceItemDescription: submission.value.invoiceItemDescription,
      invoiceItemQuantity: submission.value.invoiceItemQuantity,
      invoiceItemRate: submission.value.invoiceItemRate,
      invoiceName: submission.value.invoiceName,
      invoiceNumber: submission.value.invoiceNumber,

      status: submission.value.status,
      total: submission.value.total,

      note: submission.value.note,
    },
  });

  const sender = {
    email: "hello@demomailtrap.com",
    name: "Abdallah Mahmoud",
  };
  //send email notification
  emailClient.send({
    from: sender,
    to: [{ email: "javabyabdallah@gmail.com" }],
    template_uuid: "60b55128-822c-4e74-8421-46c5ec453bf1",
    template_variables: {
      clienName: submission.value.clientName,
      invoiceNumber: submission.value.invoiceNumber,
      invoiceDueDate: formatDate(submission.value.date),
      totalAmount: formatCurrency({
        amount: submission.value.total,
        currency: submission.value.currency,
      }),
      invoiceLink:
        process.env.NODE_ENV !== "production"
          ? `http://localhost:3000/api/invoice/${data.id}`
          : "https://invoicehub-teal.vercel.app/api/invoice/${data.id}",
    },
  });

  return redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  const session = await requireUser();

  const data = await prisma.invoice.delete({
    where: {
      id: id,
      userId: session.user?.id,
    },
  });

  return redirect("/dashboard/invoices");
}

export async function markAsPaid(id: string) {
  const session = await requireUser();

  const data = await prisma.invoice.update({
    where: {
      id: id,
      userId: session.user?.id,
    },
    data: {
      status: "PAID",
    },
  });

  return redirect("/dashboard/invoices");
}
