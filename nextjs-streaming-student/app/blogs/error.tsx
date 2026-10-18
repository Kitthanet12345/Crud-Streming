"use client";
export default function BlogError({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <main className="content-page not-found"><div className="error-code">!</div><h1>เกิดข้อผิดพลาด</h1><p>ไม่สามารถโหลดบทความได้ในขณะนี้ กรุณาลองอีกครั้ง</p><button className="button primary" onClick={() => reset()}>ลองใหม่</button></main>; }
