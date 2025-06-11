import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adjust path if different

// GET: Fetch all budgets
export async function GET() {
  const budgets = await prisma.budget.findMany();
  return NextResponse.json(budgets);
}

// POST: Create or update a budget for a specific month & category
export async function POST(req: NextRequest) {
  const { category, month, amount } = await req.json();

  if (!category || !month || isNaN(amount)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const monthStart = new Date(month + "-01");

  const existing = await prisma.budget.findFirst({
    where: { category, month: monthStart },
  });

  let budget;

  if (existing) {
    budget = await prisma.budget.update({
      where: { id: existing.id },
      data: { amount },
    });
  } else {
    budget = await prisma.budget.create({
      data: { category, month: monthStart, amount },
    });
  }

  return NextResponse.json(budget);
}
