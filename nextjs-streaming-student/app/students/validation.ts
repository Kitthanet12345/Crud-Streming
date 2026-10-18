import { z } from "zod";

export const studentSchema = z.object({
  studentCode: z.string().trim().min(1, "กรุณากรอกรหัสนักศึกษา").max(20, "รหัสนักศึกษาต้องไม่เกิน 20 ตัวอักษร"),
  firstName: z.string().trim().min(1, "กรุณากรอกชื่อ").max(100, "ชื่อต้องไม่เกิน 100 ตัวอักษร"),
  lastName: z.string().trim().min(1, "กรุณากรอกนามสกุล").max(100, "นามสกุลต้องไม่เกิน 100 ตัวอักษร"),
  email: z.string().trim().email("รูปแบบอีเมลไม่ถูกต้อง").max(160),
  phone: z.string().trim().max(30).optional().default(""),
  major: z.string().trim().min(1, "กรุณากรอกสาขาวิชา").max(120, "สาขาวิชาต้องไม่เกิน 120 ตัวอักษร"),
  year: z.coerce.number().int("ชั้นปีต้องเป็นจำนวนเต็ม").min(1, "ชั้นปีต้องไม่น้อยกว่า 1").max(8, "ชั้นปีต้องไม่เกิน 8"),
});
