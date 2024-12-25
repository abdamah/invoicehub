import { buttonVariants } from "@/components/ui/button";
import { Ban, PlusCircle } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText: string;
  href: string;
  hideLink?: boolean;
}
export default function EmptyState({
  title,
  description,
  buttonText,
  href = "/",
  hideLink = true,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col flex-1 h-full items-center justify-center border-2 rounded-md border-dashed p-8 text-center animate-in fade-in-50">
      <div className="flex items-center justify-evenly size-20 rounded-full bg-primary/10">
        <Ban className="size-10 text-primary" />
      </div>
      <h2 className="mt-6 text-xl font-semibold ">{title}</h2>
      <p className="mb-8 mt-2 text-sm text-muted-foreground">{description}</p>
      {hideLink && (
        <Link href={href} className={buttonVariants()}>
          <PlusCircle className="size-4 mr-2" />
          {buttonText}
        </Link>
      )}
    </div>
  );
}
