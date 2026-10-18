# Next.js CRUD + Streaming (ภาษาไทย)

โปรเจกต์ฝึกต่อยอดจากบทเรียน [it-nkc/streaming](https://github.com/it-nkc/streaming) โดยรวมระบบจัดการนักศึกษา CRUD กับตัวอย่าง Next.js App Router: Zod validation, `loading.tsx`, `Suspense`, Skeleton UI, dynamic route, `notFound()`, `not-found.tsx` และ `error.tsx`

## สิ่งที่มีในโปรเจกต์
- `/` จัดการข้อมูลนักศึกษา เพิ่ม/ค้นหา/แก้ไข/ลบ ผ่าน Prisma + SQLite
- `/blogs` รายการบทความสาธิต โดยหน่วงเวลา 0.9 วินาทีเพื่อให้เห็น Suspense/Skeleton
- `/blogs/1` หน้ารายละเอียดบทความ; `/blogs/999` ทดลองหน้า 404
- `/skeleton` หน้าทดลอง Skeleton UI
- `app/students/validation.ts` schema ตรวจสอบข้อมูลด้วย Zod ซึ่งถูกเรียกใช้จริงใน API สำหรับเพิ่มและแก้ไขนักศึกษา

## วิธีติดตั้งและเปิดใช้งาน
1. ติดตั้ง Node.js LTS และ VS Code
2. แตก ZIP แล้วเปิดโฟลเดอร์ `nextjs-streaming-student` ใน VS Code
3. เปิด Terminal ที่โฟลเดอร์นี้ แล้วรัน `npm install`
4. คัดลอก `.env.example` เป็นไฟล์ `.env` ในโฟลเดอร์เดียวกับ `package.json` โดยเนื้อหาเป็น `DATABASE_URL="file:./dev.db"`
5. สร้างฐานข้อมูล: `npx prisma migrate dev --name init`
6. เปิดเว็บ: `npm run dev`
7. เข้า `http://localhost:3000`

## ทดลองบทเรียน Streaming
- คลิก “เปิดบทเรียน Streaming” หรือเข้า `/blogs` แล้วสังเกต Skeleton ระหว่างโหลด
- เปิด `/blogs/1` เพื่อดูหน้ารายละเอียด
- เปิด `/blogs/999` เพื่อดูหน้า not-found
- เข้า `/skeleton` เพื่อดู Skeleton UI โดยตรง
- `app/blogs/error.tsx` เป็น error boundary ตัวอย่าง ซึ่งจะแสดงเมื่อเกิด error ระหว่าง render ของ route segment

## คำสั่งที่มีประโยชน์
- `npm run dev` เริ่มเว็บ
- `npx prisma studio` เปิดหน้าจัดการข้อมูลฐานข้อมูล
- `npx prisma migrate dev --name init` สร้าง/อัปเดต schema ฐานข้อมูล

**แก้ปัญหา DATABASE_URL:** ต้องมีไฟล์ชื่อ `.env` (ไม่ใช่ `.env.txt`) อยู่ระดับเดียวกับ `package.json` และมีบรรทัด `DATABASE_URL="file:./dev.db"`
