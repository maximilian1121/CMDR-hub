import { Suspense } from "react";

export default function Account() {
    return (
        <main className="min-h-screen">
            <Suspense fallback={<p>Loading profile...</p>}></Suspense>
        </main>
    );
}
