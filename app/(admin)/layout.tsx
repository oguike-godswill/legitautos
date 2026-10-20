import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getAdminSession } from "@/app/lib/auth";

export const metadata: Metadata = {
  title: "Admin - LegitAutos",
  description: "Manage LegitAutos inventory and customer requests",
  robots: { index: false, follow: false },
};

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The login page lives under /admin, so it must be reachable without a
  // session. src/app/(admin) resolves to this file.
  const pathname = (await headers()).get("x-pathname") ?? "";
  if (pathname === "/admin/login") return children;

  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return children;
}
