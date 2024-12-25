import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";
import WarningGif from "@/public/warning-gif.gif";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import SubmitButton from "@/app/components/SubmitButton";
import { deleteInvoice } from "@/app/actions";

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
export default async function DeleteInvoiceRoute({ params }: Params) {
  const session = await requireUser();
  const { invoiceId } = await params;

  await authorize(invoiceId, session.user?.id as string);

  return (
    <div className="flex flex-1 justify-center items-center">
      <Card className="max-w-[500px]">
        <CardHeader>
          <CardTitle>Delete Invoice</CardTitle>
          <CardDescription>
            Are you sure that want to{" "}
            <span className="text-red-500 font-bold ">delete</span> this
            invoice?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Image src={WarningGif} alt="warning Gift" className="rounded-lg" />
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Link
            href={"/dashboard/invoices"}
            className={buttonVariants({
              variant: "outline",
            })}
          >
            Cancel
          </Link>
          <form
            action={async () => {
              "use server";
              await deleteInvoice(invoiceId);
            }}
          >
            <SubmitButton text="Delete Invoice" variant="destructive" />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
