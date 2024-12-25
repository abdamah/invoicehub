import { NextRequest, NextResponse } from "next/server";
import jsPDF from "jspdf";

import prisma from "@/app/utils/db";
import { formatCurrency, formatDate } from "@/app/utils/formatCurrency";
import { redirect } from "next/navigation";

type Params = {
  params: Promise<{ invoiceId: string }>;
};
export async function GET(request: NextRequest, { params }: Params) {
  const { invoiceId } = await params;

  const data = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
    },
    select: {
      invoiceName: true,
      invoiceNumber: true,
      currency: true,
      fromName: true,
      fromEmail: true,
      fromAddress: true,
      clientName: true,
      clientEmail: true,
      clientAddress: true,
      date: true,
      dueDate: true,
      invoiceItemDescription: true,
      invoiceItemQuantity: true,
      invoiceItemRate: true,
      total: true,
      note: true,
    },
  });

  if (!data) return redirect(`/dashboard/invoices/${invoiceId}/nopdf`);

  //create pdf
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  //set font
  pdf.setFont("helvetica");

  //set header
  pdf.setFontSize(24);
  pdf.text(data.invoiceName, 20, 20);

  //from section
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("From:", 20, 35);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text([data.fromName, data.fromEmail, data.fromAddress], 20, 40);

  //client section
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Bill to:", 20, 60);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text([data.clientName, data.clientEmail, data.clientAddress], 20, 65);

  //invoice details
  pdf.setFontSize(10);
  pdf.text(`Invoice Number: INV#${data.invoiceNumber}`, 110, 35);
  pdf.text(`Date: ${formatDate(data.date)}`, 110, 40);
  pdf.text(`Due Date: Net ${data.dueDate}`, 110, 45);

  // Item table header
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text("Description", 20, 85);
  pdf.text("Quantity", 85, 85);
  pdf.text("Rate", 120, 85);
  pdf.text("Total", 150, 85);

  //draw line
  pdf.line(20, 95, 165, 95);

  //Item details
  pdf.setFont("helvetica", "normal");
  pdf.text(data.invoiceItemDescription, 20, 100);
  pdf.text(data.invoiceItemQuantity.toString(), 95, 100);
  pdf.text(
    formatCurrency({
      amount: data.invoiceItemRate,
      currency: data.currency,
    }),
    120,
    100
  );
  pdf.text(
    formatCurrency({
      amount: data.total,
      currency: data.currency,
    }),
    150,
    100
  );

  //draw line
  pdf.setFont("helvetica", "bold");
  pdf.line(20, 110, 165, 110);

  //total section

  pdf.text(`Total (${data.currency})`, 120, 120);
  pdf.text(
    formatCurrency({
      amount: data.total,
      currency: data.currency,
    }),
    150,
    120
  );

  //additional note
  if (data.note) {
    pdf.setFontSize(12);
    pdf.text("Note: ", 20, 135);
    pdf.setFont("helvetica", "normal");

    pdf.setFontSize(10);
    pdf.text(data.note, 20, 140);
  }

  // generate pdf as buffer
  const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));

  //return pdf as download

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
    },
  });
}
