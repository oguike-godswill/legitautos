import Link from "next/link";
import { Home, Car, Users, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="flex items-center">
        <div className="w-[280px] h-[340px] flex items-center justify-center">
          <span className="text-[29rem] font-normal text-white leading-none select-none" style={{ fontFamily: 'Bungee, cursive' }}>
            4
          </span>
        </div>

        <div className="w-[280px] h-[340px] bg-white rounded-2xl border border-gray-200 px-6 py-12 flex flex-col justify-center text-center">
          <h1 className="text-xl font-bold text-dark-900 mb-2">Page Not Found</h1>
          <p className="text-sm text-dark-500 mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>

          <div className="space-y-2">
            <Link
              href="/"
              className="group flex items-center justify-between rounded-xl bg-primary/5 px-4 py-3 hover:bg-primary/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Home className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-dark-800">Home</span>
              </div>
              <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/cars"
              className="group flex items-center justify-between rounded-xl bg-primary/5 px-4 py-3 hover:bg-primary/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Car className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-dark-800">Browse Cars</span>
              </div>
              <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/about"
              className="group flex items-center justify-between rounded-xl bg-primary/5 px-4 py-3 hover:bg-primary/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-dark-800">About Us</span>
              </div>
              <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="w-[280px] h-[340px] flex items-center justify-center">
          <span className="text-[29rem] font-normal text-white leading-none select-none" style={{ fontFamily: 'Bungee, cursive' }}>
            4
          </span>
        </div>
      </div>
    </div>
  );
}
