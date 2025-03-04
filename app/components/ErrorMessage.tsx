import React from "react";

export default function ErrorMessage({ message }: { message?: string[] }) {
  return <p className="text-sm text-red-500">{message}</p>;
}
