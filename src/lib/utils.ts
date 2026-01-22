import { clsx, type ClassValue } from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
