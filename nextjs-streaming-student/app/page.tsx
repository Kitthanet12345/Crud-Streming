"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type Student = {
  id: number;
  studentCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  major: string;
  year: number;
  createdAt: string;
  updatedAt: string;
};

const blankForm = {
  studentCode: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  major: "",
  year: "1",
};

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [form, setForm] = useState(blankForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/students", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "โหลดข้อมูลไม่สำเร็จ");
      setStudents(data);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "เชื่อมต่อระบบไม่ได้");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadStudents(); }, [loadStudents]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return students.filter((s) =>
      `${s.studentCode} ${s.firstName} ${s.lastName} ${s.email} ${s.major} ${s.phone}`.toLowerCase().includes(q)
    );
  }, [students, search]);

  function setField(key: keyof typeof blankForm, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(blankForm);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch(editingId ? `/api/students/${editingId}` : "/api/students", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, year: Number(form.year) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "บันทึกข้อมูลไม่สำเร็จ");
      setMessage(editingId ? "แก้ไขข้อมูลนักศึกษาเรียบร้อยแล้ว" : "เพิ่มข้อมูลนักศึกษาเรียบร้อยแล้ว");
      cancelEdit();
      await loadStudents();
    } catch (e) {
      setError(e instanceof Error ? e.message : "บันทึกข้อมูลไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  }

  function edit(student: Student) {
    setEditingId(student.id);
    setForm({
      studentCode: student.studentCode,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone,
      major: student.major,
      year: String(student.year),
    });
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(student: Student) {
    if (!window.confirm(`ต้องการลบข้อมูล ${student.firstName} ${student.lastName} ใช่หรือไม่?`)) return;
    setMessage("");
    setError("");
    try {
      const response = await fetch(`/api/students/${student.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "ลบข้อมูลไม่สำเร็จ");
      if (editingId === student.id) cancelEdit();
      setMessage("ลบข้อมูลนักศึกษาเรียบร้อยแล้ว");
      await loadStudents();
    } catch (e) {
      setError(e instanceof Error ? e.message : "ลบข้อมูลไม่สำเร็จ");
    }
  }

  return (
    <main className="page">
      <header className="hero">
        <div className="eyebrow">STUDENT MANAGEMENT · NEXT.JS + PRISMA</div>
        <h1>ระบบจัดการข้อมูลนักศึกษา</h1>
        <p>เพิ่มข้อมูล ค้นหา แก้ไข และลบข้อมูลนักศึกษา พร้อมบันทึกลงฐานข้อมูล SQLite</p>
        <nav className="quick-links"><a href="/blogs">เปิดบทเรียน Streaming →</a><a href="/skeleton">ดูตัวอย่าง Skeleton →</a></nav>
        <div className="stats">
          <div className="stat"><span>นักศึกษาทั้งหมด</span><strong>{students.length}</strong></div>
          <div className="stat"><span>ผลการค้นหา</span><strong>{filtered.length}</strong></div>
          <div className="stat"><span>ระบบฐานข้อมูล</span><strong>SQLite</strong></div>
        </div>
      </header>

      {message && <div className="notice success" role="status">{message}</div>}
      {error && <div className="notice failure" role="alert">{error}<button type="button" onClick={() => void loadStudents()}>ลองใหม่</button></div>}

      <section className="panel">
        <div className="section-heading">
          <div><span className="step">STEP 01</span><h2>{editingId ? `แก้ไขข้อมูลนักศึกษา #${editingId}` : "เพิ่มข้อมูลนักศึกษา"}</h2></div>
          {editingId !== null && <button className="button ghost" type="button" onClick={cancelEdit}>ยกเลิก</button>}
        </div>
        <form className="student-form" onSubmit={submit}>
          <label>รหัสนักศึกษา<input value={form.studentCode} onChange={(e) => setField("studentCode", e.target.value)} placeholder="เช่น 65010001" required maxLength={30} /></label>
          <label>ชื่อ<input value={form.firstName} onChange={(e) => setField("firstName", e.target.value)} placeholder="ชื่อจริง" required maxLength={100} /></label>
          <label>นามสกุล<input value={form.lastName} onChange={(e) => setField("lastName", e.target.value)} placeholder="นามสกุล" required maxLength={100} /></label>
          <label>อีเมล<input type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} placeholder="student@example.com" required maxLength={160} /></label>
          <label>เบอร์โทรศัพท์<input type="tel" value={form.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="08x-xxx-xxxx" maxLength={30} /></label>
          <label>สาขาวิชา<input value={form.major} onChange={(e) => setField("major", e.target.value)} placeholder="เช่น เทคโนโลยีสารสนเทศ" required maxLength={120} /></label>
          <label>ชั้นปี<select value={form.year} onChange={(e) => setField("year", e.target.value)}>{[1,2,3,4,5,6,7,8].map((n) => <option key={n} value={n}>ชั้นปีที่ {n}</option>)}</select></label>
          <div className="form-action"><button className="button primary submit" type="submit" disabled={saving}>{saving ? "กำลังบันทึก..." : editingId ? "บันทึกการแก้ไข" : "＋ เพิ่มนักศึกษา"}</button></div>
        </form>
      </section>

      <section className="panel">
        <div className="section-heading list-heading">
          <div><span className="step">STEP 02</span><h2>รายชื่อนักศึกษา</h2><p className="muted">ค้นหาด้วยรหัส ชื่อ อีเมล หรือสาขาวิชา</p></div>
          <button className="button ghost" type="button" onClick={() => void loadStudents()}>↻ โหลดข้อมูลใหม่</button>
        </div>
        <div className="search-wrap"><span aria-hidden="true">⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ค้นหาข้อมูลนักศึกษา..." aria-label="ค้นหานักศึกษา" /></div>
        <div className="table-wrap"><table>
          <thead><tr><th>รหัสนักศึกษา</th><th>ชื่อ-นามสกุล</th><th>สาขาวิชา / ชั้นปี</th><th>ติดต่อ</th><th className="actions-cell">จัดการ</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={5} className="empty">กำลังโหลดข้อมูล...</td></tr> :
              filtered.map((s) => <tr key={s.id}>
                <td><span className="student-code">{s.studentCode}</span></td>
                <td><strong>{s.firstName} {s.lastName}</strong></td>
                <td>{s.major}<small>ชั้นปีที่ {s.year}</small></td>
                <td>{s.email}{s.phone && <small>{s.phone}</small>}</td>
                <td className="actions-cell"><button className="button small edit" type="button" onClick={() => edit(s)}>แก้ไข</button><button className="button small delete" type="button" onClick={() => void remove(s)}>ลบ</button></td>
              </tr>)}
            {!loading && filtered.length === 0 && <tr><td colSpan={5} className="empty">{search ? "ไม่พบข้อมูลที่ค้นหา" : "ยังไม่มีข้อมูลนักศึกษา กรุณาเพิ่มข้อมูลด้านบน"}</td></tr>}
          </tbody>
        </table></div>
        <p className="footnote">ข้อมูลบันทึกใน SQLite ผ่าน Prisma • รหัสนักศึกษาและอีเมลต้องไม่ซ้ำกัน</p>
      </section>
      <footer>Student CRUD • Next.js App Router · Prisma ORM · SQLite</footer>
    </main>
  );
}
