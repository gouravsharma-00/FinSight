"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const categories = [
  "FOOD",
  "RENT",
  "TRAVEL",
  "UTILITIES",
  "ENTERTAINMENT",
  "HEALTH",
  "OTHER",
];

export default function BudgetPage() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [newBudgets, setNewBudgets] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const txRes = await fetch("/api/transactions");
      const txData = await txRes.json();
      setTransactions(txData);

      const bRes = await fetch("/api/budgets");
      const bData = await bRes.json();
      setBudgets(bData);
    };
    fetchData();
  }, []);

  const currentMonth = new Date(month);
  const txnsThisMonth = transactions.filter((t) => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth.getMonth() && date.getFullYear() === currentMonth.getFullYear();
  });

  const actuals = categories.map((cat) => {
    const total = txnsThisMonth
      .filter((t) => t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0);
    const budget = budgets.find(
      (b) => b.category === cat && new Date(b.month).toISOString().slice(0, 7) === month
    )?.amount || 0;
    return {
      category: cat,
      budget,
      actual: total,
    };
  });

  const handleBudgetChange = (cat, value) => {
    setNewBudgets((prev) => ({ ...prev, [cat]: value }));
  };

  const saveBudgets = async () => {
    await Promise.all(
      Object.entries(newBudgets).map(([cat, amount]) =>
        fetch("/api/budgets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category: cat, month, amount: parseFloat(amount) }),
        })
      )
    );
    const bRes = await fetch("/api/budgets");
    const bData = await bRes.json();
    setBudgets(bData);
    setNewBudgets({});
  };

  const overBudget = actuals.filter((c) => c.actual > c.budget);
  const topCategory = actuals.reduce((a, b) => (a.actual > b.actual ? a : b), { actual: 0 });

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">Monthly Budgets</h2>

      <div className="max-w-sm">
        <label className="block mb-1">Select Month:</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat} className="border p-4 rounded shadow">
            <label className="block text-sm font-medium mb-1">{cat}</label>
            <input
              type="number"
              value={newBudgets[cat] || ""}
              onChange={(e) => handleBudgetChange(cat, e.target.value)}
              placeholder="Enter budget"
              className="w-full border p-2 rounded"
            />
          </div>
        ))}
      </div>

      <button
        onClick={saveBudgets}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Budgets
      </button>

      <h3 className="text-xl font-semibold mt-10">Budget vs Actual Chart</h3>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={actuals}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="budget" fill="#10b981" name="Budget" />
          <Bar dataKey="actual" fill="#ef4444" name="Spent" />
        </BarChart>
      </ResponsiveContainer>

      <h3 className="text-lg font-semibold">Insights</h3>
      <div className="space-y-2">
        {overBudget.length === 0 ? (
          <div className="text-green-600">You are within budget in all categories 🎉</div>
        ) : (
          overBudget.map((c) => (
            <div key={c.category} className="text-red-600">
              Over budget in {c.category} by ₹{(c.actual - c.budget).toFixed(2)}
            </div>
          ))
        )}
        <div className="font-medium">
          Top spending: {topCategory.category} – ₹{topCategory.actual.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
