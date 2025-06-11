"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

export default function MonthlyChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((transactions) => {
        const monthly = transactions.reduce((acc: any, t: any) => {
          const month = new Date(t.date).toLocaleString("default", { month: "short", year: "numeric" });
          acc[month] = (acc[month] || 0) + t.amount;
          return acc;
        }, {});

        const formatted = Object.entries(monthly).map(([month, total]) => ({ month, total }));
        setData(formatted);
      });
  }, []);

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#60A5FA" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
