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
  // Counts only. The previous version showed hardcoded "+12% vs last month"
  // trends beside these real numbers, which presented invented figures as
  // fact. Restore trends only when they are computed from actual history.
  const cards = [
    {
      title: "Total Cars",
      value: stats.totalCars,
      icon: Car,
      color: "bg-primary-50 text-primary-600",
    },
    {
      title: "Total Views",
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: "bg-success-soft text-success",
    },
    {
      title: "Available",
      value: stats.availableCars,
      icon: TrendingUp,
      color: "bg-info-soft text-info",
    },
    {
      title: "Sold",
      value: stats.soldCars,
      icon: DollarSign,
      color: "bg-warning-soft text-warning",
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
        </motion.div>
      ))}
    </div>
  );
}
