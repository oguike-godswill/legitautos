"use client";

import { motion } from "framer-motion";
import { Car, Eye, TrendingUp, DollarSign } from "lucide-react";

interface StatsData {
  totalCars: number;
  totalViews: number;
  availableCars: number;
  soldCars: number;
}

interface StatsCardsProps {
  stats: StatsData;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Cars",
      value: stats.totalCars,
      icon: Car,
      color: "bg-primary-50 text-primary-600",
      trend: "+12%",
    },
    {
      title: "Total Views",
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: "bg-emerald-50 text-emerald-600",
      trend: "+24%",
    },
    {
      title: "Available",
      value: stats.availableCars,
      icon: TrendingUp,
      color: "bg-sky-50 text-sky-600",
      trend: "+8%",
    },
    {
      title: "Sold",
      value: stats.soldCars,
      icon: DollarSign,
      color: "bg-amber-50 text-amber-600",
      trend: "+15%",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl border border-gray-200 p-5"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-dark-500">{card.title}</p>
              <p className="text-2xl font-bold text-dark-900 mt-1">{card.value}</p>
            </div>
            <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center`}>
              <card.icon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1">
            <span className="text-xs font-medium text-emerald-600">{card.trend}</span>
            <span className="text-xs text-dark-400">vs last month</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
