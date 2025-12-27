"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
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


  if (isLoading) return <p>Loading...</p>;

  if (!user) return null; // prevents flicker

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
    </div>
  );
}
