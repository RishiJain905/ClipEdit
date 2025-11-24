"use client";

import { SignupPage } from "@/components/SignupPage";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  return (
    <SignupPage 
      onNavigateToLogin={() => router.push("/login")}
      onNavigateToHome={() => router.push("/")}
    />
  );
}
