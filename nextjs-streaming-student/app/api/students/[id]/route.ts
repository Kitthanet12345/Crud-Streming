import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { studentSchema } from "@/app/students/validation";

export const runtime = "nodejs";
type RouteContext = { params: Promise<{ id: string }> };

async function parseId(context: RouteContext) {
  const { id } = await context.params;
  const value = Number(id);
  return Number.isInteger(value) && value > 0 ? value : null;
}

export async function PUT(request: Request, context: RouteContext) {
  const id = await parseId(context);
  if (!id) return NextResponse.json({ error: "รหัสรายการไม่ถูกต้อง" }, { status: 400 });

  try {
    const body = await request.json();
    const parsed = studentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
    }
    const { studentCode, firstName, lastName, email, phone, major, year } = parsed.data;

    const student = await prisma.student.update({
      where: { id },
      data: { studentCode, firstName, lastName, email, phone, major, year }
    });
    return NextResponse.json(student);
  } catch (error) {
    const message = error instanceof Error && error.message.includes("Unique constraint")
      ? "รหัสนักศึกษาหรืออีเมลนี้มีอยู่ในระบบแล้ว"
      : "แก้ไขข้อมูลไม่สำเร็จ อาจไม่มีข้อมูลนี้หรือรหัส/อีเมลซ้ำ";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const id = await parseId(context);
  if (!id) return NextResponse.json({ error: "รหัสรายการไม่ถูกต้อง" }, { status: 400 });

  try {
    await prisma.student.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "ลบข้อมูลไม่สำเร็จ อาจไม่มีนักศึกษารายนี้" }, { status: 404 });
  }
}
