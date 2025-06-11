import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  const body = await req.json();
  const { amount, date, description, category } = body;

  const updated = await prisma.transaction.update({
    where: { id },
    data: {
      amount: parseFloat(amount),
      date: new Date(date),
      description,
      category,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  await prisma.transaction.delete({ where: { id } });

  return NextResponse.json({ message: "Deleted" });
}
