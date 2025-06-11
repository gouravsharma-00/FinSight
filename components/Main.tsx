"use client";
import { useEffect, useState } from "react";

type Transaction = {
  id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
};

const categories = ["FOOD", "RENT", "TRAVEL", "UTILITIES", "ENTERTAINMENT", "HEALTH", "OTHER"];

export default function TransactionManager() {
  const [form, setForm] = useState({ amount: "", date: "", description: "", category: "FOOD" });
  const [error, setError] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [filterMonth, setFilterMonth] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const res = await fetch("/api/transactions");
    const data = await res.json();
    setTransactions(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.amount || !form.date || !form.description) {
      setError("All fields are required.");
      return;
    }

    const url = editId ? `/api/transactions/${editId}` : "/api/transactions";
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const msg = await res.json();
      setError(msg.error || "Something went wrong.");
    } else {
      setForm({ amount: "", date: "", description: "", category: "FOOD" });
      setEditId(null);
      setError("");
      fetchTransactions();
    }
  };

  const handleEdit = (t: Transaction) => {
    setEditId(t.id);
    setForm({
      amount: t.amount.toString(),
      date: t.date.split("T")[0],
      description: t.description,
      category: t.category,
    });
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    fetchTransactions();
  };

  const filtered = transactions.filter((t) => {
    const tDate = new Date(t.date);
    const monthMatch = !filterMonth || tDate.toISOString().slice(0, 7) === filterMonth;
    const categoryMatch = !filterCategory || t.category === filterCategory;
    return monthMatch && categoryMatch;
  });

  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="space-y-8 p-4">
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded shadow max-w-md">
        <h2 className="text-xl font-semibold">{editId ? "Edit" : "Add"} Transaction</h2>
        {error && <p className="text-red-500">{error}</p>}

        <input
          type="number"
          step="0.01"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />

        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full p-2 border rounded"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          {editId ? "Update" : "Add"} Transaction
        </button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setForm({ amount: "", date: "", description: "", category: "FOOD" });
            }}
            className="ml-4 px-4 py-2 bg-gray-400 text-white rounded"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <input
          type="month"
          value={filterMonth}
          onChange={(e) => {
            setCurrentPage(1);
            setFilterMonth(e.target.value);
          }}
          className="border p-2 rounded"
        />

        <select
          value={filterCategory}
          onChange={(e) => {
            setCurrentPage(1);
            setFilterCategory(e.target.value);
          }}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Transaction List */}
      <div className="max-w-2xl">
        <h2 className="text-xl font-semibold mb-2">Transactions</h2>
        <ul className="space-y-2">
          {paginated.map((t) => (
            <li key={t.id} className="border p-2 rounded shadow flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="font-medium">{new Date(t.date).toLocaleDateString()}</span>: ₹
                {t.amount.toFixed(2)} — <span className="text-blue-600">{t.category}</span> — {t.description}
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button
                  onClick={() => handleEdit(t)}
                  className="text-sm px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="text-sm px-3 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        {/* Pagination */}
        <div className="mt-4 flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
