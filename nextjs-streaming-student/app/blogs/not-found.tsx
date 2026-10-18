import Link from "next/link";
export default function BlogNotFound() { return <main className="content-page not-found"><div className="error-code">404</div><h1>ไม่พบบทความนี้</h1><p>รหัสบทความอาจไม่มีอยู่ หรือถูกลบออกจากรายการแล้ว</p><Link className="button primary" href="/blogs">กลับไปหน้าบทความ</Link></main>; }
