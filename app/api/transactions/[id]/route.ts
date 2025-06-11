// app/api/transactions/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function PUT(req: NextRequest, { params }) {
  const body = await req.json();
  const { amount, date, description, category } = body;

  const updated = await prisma.transaction.update({
    where: { id: params.id },
    data: { amount: parseFloat(amount), date: new Date(date), description, category },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }) {
  await prisma.transaction.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "Deleted" });
}
