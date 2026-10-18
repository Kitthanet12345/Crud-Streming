import { BlogListSkeleton } from "@/app/ui/blog-skeleton";
export default function Loading() { return <main className="content-page"><p className="loading-label">กำลังโหลดบทความ...</p><BlogListSkeleton /></main>; }
