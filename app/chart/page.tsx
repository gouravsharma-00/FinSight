"use client";
import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
  ResponsiveContainer
} from "recharts";

type Transaction = {
  id: string;
  amount: number;
  date: string;
  category: string;
};

type ChartDataItem = {
  label: string;
  amount: number;
};

const categories = ["ALL", "FOOD", "RENT", "TRAVEL", "UTILITIES", "ENTERTAINMENT", "HEALTH", "OTHER"];
const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"];

export default function ChartPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");

  useEffect(() => {
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(data));
  }, []);

  const filtered = filterCategory === "ALL"
    ? transactions
    : transactions.filter((t) => t.category === filterCategory);

  const groupedBy =
    chartType === "bar"
      ? filtered.reduce((acc, t) => {
          const key = new Date(t.date).toLocaleString("default", {
            month: "short",
            year: "numeric",
          });
          acc[key] = (acc[key] || 0) + t.amount;
          return acc;
        }, {} as Record<string, number>)
      : filtered.reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {} as Record<string, number>);

  const chartData: ChartDataItem[] = Object.entries(groupedBy).map(([label, amount]) => ({
    label,
    amount: Number(amount.toFixed(2)),
  }));

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">Expense Chart</h2>

      <div className="flex flex-wrap gap-4 items-center">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border p-2 rounded"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "ALL" ? "All Categories" : cat}
            </option>
          ))}
        </select>

        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value as "bar" | "pie")}
          className="border p-2 rounded"
        >
          <option value="bar">Bar Chart</option>
          <option value="pie">Pie Chart</option>
        </select>
      </div>

      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" ? (
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                label
              >
                {chartData.map((_, index) => (
                  <Cell key={index} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
