import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { studentSchema } from "@/app/students/validation";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();
    const students = await prisma.student.findMany({
      where: q ? {
        OR: [
          { studentCode: { contains: q } },
          { firstName: { contains: q } },
          { lastName: { contains: q } },
          { email: { contains: q } },
          { major: { contains: q } }
        ]
      } : undefined,
      orderBy: [{ year: "asc" }, { studentCode: "asc" }]
    });
    return NextResponse.json(students);
  } catch {
    return NextResponse.json({ error: "อ่านข้อมูลไม่สำเร็จ กรุณารัน Prisma migration ก่อน" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = studentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
    }
    const { studentCode, firstName, lastName, email, phone, major, year } = parsed.data;

    const student = await prisma.student.create({
      data: { studentCode, firstName, lastName, email, phone, major, year }
    });
    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    const message = error instanceof Error && error.message.includes("Unique constraint")
      ? "รหัสนักศึกษาหรืออีเมลนี้มีอยู่ในระบบแล้ว"
      : "เพิ่มข้อมูลไม่สำเร็จ กรุณาตรวจสอบรหัสนักศึกษาและอีเมล";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
