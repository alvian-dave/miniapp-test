// pages/dashboard.tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Dashboard from "@/components/Dashboard";

export default function DashboardPage() {
  const router = useRouter();
  const [nullifierHash, setNullifierHash] = useState<string | null>(null);

  useEffect(() => {
    if (router.isReady) {
      const hash = router.query.nullifier;
      if (typeof hash === "string") {
        setNullifierHash(hash);
      } else {
        router.replace("/"); // redirect jika nullifier tidak valid
      }
    }
  }, [router.isReady, router.query.nullifier]);

  if (!nullifierHash) {
    return <div className="text-center p-8">Loading dashboard...</div>;
  }

  return <Dashboard nullifierHash={nullifierHash} />;
}
