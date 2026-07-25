import {
  Wallet,
  TrendingUp,
  IndianRupee,
  BarChart3,
} from "lucide-react";

export const portfolioSummary = [
  {
    title: "Total investment",
    amount: "₹1,50,000",
    trend: "+5.4% this month",
    trendColor: "text-blue-600",
    icon: Wallet,
  },
  {
    title: "Current Value",
    amount: "₹1,70,000",
    trend: "+13.3% overall",
    trendColor: "text-emerald-600",
    icon: TrendingUp,
  },
  {
    title: "Total Profit",
    amount: "+₹20,000",
    trend: "+15.8% return",
    trendColor: "text-green-600",
    icon: IndianRupee,
  },
  {
    title: "XIRR",
    amount: "35.55%",
    trend: "Excellent",
    trendColor: "text-purple-600",
    icon: BarChart3,
  }, 
];