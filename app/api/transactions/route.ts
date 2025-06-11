// app/api/transactions/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { amount, date, description, category } = body;

  if (!amount || !date || !description || !category) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  const transaction = await prisma.transaction.create({
    data: { amount: parseFloat(amount), date: new Date(date), description, category },
  });

  return NextResponse.json(transaction);
}

export async function GET() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { date: "desc" },
  });
  return NextResponse.json(transactions);
}
