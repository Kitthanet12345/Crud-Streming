import Link from "next/link";
import { notFound } from "next/navigation";
import { blogs } from "@/lib/blogs";

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
 const { id } = await params; const blog = blogs.find((item) => item.id === id); if (!blog) notFound();
 return <main className="content-page"><article className="article"><Link className="back-link" href="/blogs">← กลับไปหน้าบทความ</Link><span className="blog-category">{blog.category}</span><h1>{blog.title}</h1><p className="blog-meta">{blog.date} · บทความตัวอย่างสำหรับฝึก Next.js</p><div className="article-body"><p>{blog.content}</p><p>ตัวอย่างนี้เป็นเนื้อหาสาธิตสำหรับฝึกเขียนโปรแกรม สามารถแก้ไขข้อมูลบทความได้ที่ไฟล์ <code>lib/blogs.ts</code></p></div></article></main>;
}
