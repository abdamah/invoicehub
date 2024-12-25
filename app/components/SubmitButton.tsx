"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React from "react";
import { useFormStatus } from "react-dom";
import { twMerge } from "tailwind-merge";

interface SubmitButtonProps {
  text: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
  className?: string;
}
export default function SubmitButton({
  text,
  variant,
  className,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled className="w-full" variant={variant}>
          <Loader2 className="size-4 mr-2 animate-spin" />
          Please wait..
        </Button>
      ) : (
        <Button
          type="submit"
          className={twMerge("w-full", className)}
          variant={variant}
        >
          {text}
        </Button>
      )}
    </>
  );
}
