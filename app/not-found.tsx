import Link from "next/link";
import { Home, Car, Sparkles, ArrowRight, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#070B14] text-white flex items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-teal/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="max-w-lg w-full bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 text-center relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-teal/15 border border-teal/30 text-teal flex items-center justify-center mx-auto mb-6">
          <Compass className="w-7 h-7" />
        </div>
        <span className="t-mono text-xs font-bold uppercase tracking-[0.2em] text-teal block mb-2">
          Error 404 • Off Route
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-3">
          Vehicle or Page Not Found
        </h1>
        <p className="text-sm text-white/60 leading-relaxed mb-8">
          The listing or page you&apos;re looking for may have been sold, moved, or had its URL updated. Explore our live Lagos inventory below.
        </p>

        <div className="space-y-3 text-left">
          <Link
            href="/cars"
            className="group flex items-center justify-between rounded-2xl bg-teal px-5 py-4 text-white font-bold hover:bg-teal-600 transition-all"
          >
            <div className="flex items-center gap-3">
              <Car className="w-5 h-5" />
              <span className="text-sm">Browse Live Showroom Inventory</span>
            </div>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/request"
            className="group flex items-center justify-between rounded-2xl bg-white/[0.06] border border-white/10 px-5 py-3.5 text-white hover:bg-white/10 transition-all"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-teal" />
              <span className="text-sm font-semibold">Request a Specific Vehicle</span>
            </div>
            <ArrowRight className="w-4 h-4 text-white/50 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/"
            className="group flex items-center justify-between rounded-2xl bg-white/[0.04] border border-white/10 px-5 py-3.5 text-white/80 hover:text-white hover:bg-white/10 transition-all"
          >
            <div className="flex items-center gap-3">
              <Home className="w-4 h-4 text-teal" />
              <span className="text-sm font-semibold">Return to Showroom Home</span>
            </div>
            <ArrowRight className="w-4 h-4 text-white/50 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
