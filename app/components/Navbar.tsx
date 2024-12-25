import Image from "next/image";
import Link from "next/link";

import Logo from "@/public/logo.png";
import { buttonVariants } from "@/components/ui/button";
import { RainbowButton } from "@/components/ui/rainbow-button";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between  py-5">
      <Link href="/" className="flex items-center gap-2">
        <Image src={Logo} alt="logo image" className="size-10" />
        <h3 className="text-3xl font-semibold">
          Invoie<span className="text-blue-500">Hub</span>
        </h3>
      </Link>

      <Link href="/login" className="hidden md:block">
        <RainbowButton>Get Started</RainbowButton>
      </Link>
    </nav>
  );
}
