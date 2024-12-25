import prisma from "@/app/utils/db";
import { formatCurrency, formatDate } from "@/app/utils/formatCurrency";
import { requireUser } from "@/app/utils/hooks";
import { emailClient } from "@/app/utils/mailtrap";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: Promise<{ invoiceId: string }>;
};
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const session = await requireUser();
    const { invoiceId } = await params;

    const data = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
        userId: session.user?.id,
      },
      select: {
        id: true,
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
    if (!data)
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

    const sender = {
      email: "hello@demomailtrap.com",
      name: "Abdallah Mahmoud",
    };
    //send email notification
    emailClient.send({
      from: sender,
      to: [{ email: "javabyabdallah@gmail.com" }],
      template_uuid: "08fe0aa4-745f-4dd1-adcc-77ecdeb3392a",
      template_variables: {
        first_name: data.clientName,
        company_info_name: "Invoice Hub",
        company_info_address: data.clientAddress,
        company_info_city: "Hargeisa",
        company_info_zip_code: "1234",
        company_info_country: "Somaliland",
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send Email reminder" },
      {
        status: 500,
      }
    );
  }
}
