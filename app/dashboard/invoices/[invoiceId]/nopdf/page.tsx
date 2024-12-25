import EmptyState from "@/app/components/EmptyState";
import { requireUser } from "@/app/utils/hooks";

type Params = {
  params: Promise<{ invoiceId: string }>;
};
export default async function NoPdfRoute({ params }: Params) {
  const session = await requireUser();
  const { invoiceId } = await params;
  return (
    <EmptyState
      title="Invoice pdf not found"
      description={`This is ${invoiceId} does not exist in our app`}
      buttonText="Back to home"
      href="/"
    />
  );
}
