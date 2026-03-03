"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const RESUME_FLAG = "nailed-it-resume-recording";

/**
 * Global guard: if the user has a pending recording (stored before OAuth redirect),
 * redirect them to /record?resume=true regardless of where OAuth dumped them.
 * Rendered in root layout so it runs on every page.
 */
export function ResumeRecordingGuard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't redirect if already on /record (it handles the flag itself)
    if (pathname === "/record") return;

    const flag = localStorage.getItem(RESUME_FLAG);
    if (flag === "true") {
      // Don't clear the flag — /record page will clear it and handle the upload
      router.replace("/record?resume=true");
    }
  }, [router, pathname]);

  return null;
}
