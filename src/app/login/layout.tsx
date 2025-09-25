import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تسجيل الدخول - إرتقاء",
  description:
    "سجل دخولك للوصول إلى لوحة التحكم الإدارية لمنصة إرتقاء التعليمية",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
