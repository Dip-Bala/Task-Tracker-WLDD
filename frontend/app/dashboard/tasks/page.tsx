"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TasksPage() {
  const router = useRouter();
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["me"],
    queryFn: () => api.get("/auth/me").then(res => res.data),
    retry: false,
  });

  useEffect(() => {
    if (isError) {
      router.replace("/login"); // 👈 important: replace, not push
    }
  }, [isError, router]);

  if (isLoading) return <p>Loading...</p>;

  if (!user) return null; // prevents flicker

  return (
    <div>
      <h1>tasks</h1>
    </div>
  );
}
