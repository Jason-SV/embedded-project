'use client';

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the dashboard
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="overflow-visible">
      {/* You can add a loading indicator here if desired */}
    </div>
  );
}