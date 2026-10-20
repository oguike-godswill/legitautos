import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession, isAdminAuthConfigured } from "@/app/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <h1 className="text-xl font-bold text-dark-900">Admin sign in</h1>
          <p className="text-sm text-dark-500 mt-1 mb-6">
            Sign in to manage LegitAutos inventory and customer requests.
          </p>

          {!isAdminAuthConfigured() ? (
            <div
              role="alert"
              className="rounded-lg border border-warning/30 bg-warning/5 p-4 text-sm text-dark-600 leading-relaxed"
            >
              <p className="font-semibold text-dark-800 mb-1">
                Admin login is not configured
              </p>
              <p>
                Set <code className="font-mono text-xs">ADMIN_EMAIL</code> and{" "}
                <code className="font-mono text-xs">ADMIN_PASSWORD</code> (or{" "}
                <code className="font-mono text-xs">ADMIN_PASSWORD_HASH</code>),
                plus <code className="font-mono text-xs">ADMIN_SESSION_SECRET</code>,
                in your environment to enable sign in.
              </p>
            </div>
          ) : (
            <LoginForm />
          )}
        </div>
      </div>
    </div>
  );
}
