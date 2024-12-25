import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import PaidGif from "@/public/paid-gif.gif";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import SubmitButton from "@/app/components/SubmitButton";
import { markAsPaid } from "@/app/actions";
import { redirect } from "next/navigation";
import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";

async function authorize(id: string, userId: string) {
  const data = await prisma.invoice.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!data) return redirect("/dashboard/invoices");
}

type Params = {
  params: Promise<{ invoiceId: string }>;
};

export default async function MarkAsPaid({ params }: Params) {
  const session = await requireUser();
  const { invoiceId } = await params;

  await authorize(invoiceId, session.user?.id as string);

  return (
    <div className="flex flex-1 justify-center items-center">
      <Card className="max-w-[500px]">
        <CardHeader>
          <CardTitle>Mark as Paid</CardTitle>
          <CardDescription>
            Are you sure want to mark this invoice as{" "}
            <span className="text-green-500 font-bold">paid</span>?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Image src={PaidGif} alt="Paid Gif" className="rounded-lg" />
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Link
            href="/dashboard/invoices"
            className={buttonVariants({
              variant: "outline",
            })}
          >
            Cancel
          </Link>
          <form
            action={async () => {
              "use server";
              await markAsPaid(invoiceId);
            }}
          >
            <SubmitButton
              text="Mark as Paid"
              className="bg-green-500 hover:bg-green-400"
            />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
