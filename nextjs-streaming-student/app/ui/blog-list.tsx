import Link from "next/link";
import { blogs } from "@/lib/blogs";

export default async function BlogList() {
  // Demo delay to make loading.tsx and Suspense visible during practice.
  await new Promise((resolve) => setTimeout(resolve, 900));
  return <div className="blog-grid">{blogs.map((blog) => <article className="blog-card" key={blog.id}><span className="blog-category">{blog.category}</span><h2><Link href={`/blogs/${blog.id}`}>{blog.title}</Link></h2><p>{blog.excerpt}</p><div className="blog-meta">{blog.date} · อ่าน 2 นาที</div><Link className="read-link" href={`/blogs/${blog.id}`}>อ่านบทความ →</Link></article>)}</div>;
}
