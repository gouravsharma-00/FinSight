// app/api/transactions/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { amount, date, description, category } = body;

  const updated = await prisma.transaction.update({
    where: { id: params.id },
    data: { amount: parseFloat(amount), date: new Date(date), description, category },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.transaction.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "Deleted" });
}
