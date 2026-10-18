import { Suspense } from "react";
import BlogList from "@/app/ui/blog-list";
import { BlogListSkeleton } from "@/app/ui/blog-skeleton";

export default function BlogsPage() { return <main className="content-page"><header className="page-intro"><span className="eyebrow">NEXT.JS STREAMING PRACTICE</span><h1>บทความเทคโนโลยี</h1><p>ฝึกใช้ Loading UI, Suspense, Skeleton, not-found และ error boundary</p></header><Suspense fallback={<BlogListSkeleton />}><BlogList /></Suspense></main>; }
