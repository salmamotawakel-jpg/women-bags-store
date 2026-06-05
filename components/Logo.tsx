import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import logo from "../images/logo01.png";

// ✅ فقط أضف spanDesign هنا
const Logo = ({
  className,
  spanDesign,
}: {
  className?: string;
  spanDesign?: string;
}) => {
  return (
    <Link href="/" className="inline-flex items-center">
      <Image
        src={logo}
        alt="Tafoukt Logo"
        width={120}
        height={40}
        priority
        className={cn("object-contain transition hover:scale-105", className)}
      />
    </Link>
  );
};

export default Logo;