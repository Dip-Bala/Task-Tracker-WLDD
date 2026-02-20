"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { useState } from "react";
import { LogOut, User } from "lucide-react";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [showLogout, setShowLogout] = useState(false);

  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => api.get("/auth/me").then(res => res.data.user),
  });

  const handleLogout = async () => {
    await api.post("/auth/logout");
    queryClient.clear();
    window.location.href = "/login";
  };

  if (isLoading) return <p className="text-white/50">Loading...</p>;

  return (
    <div className="space-y-10 max-w-xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>

      <div className="bg-[var(--color-muted-background)] border border-white/5 rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[var(--color-indigo)] text-white">
            <User size={20} />
          </div>
          <h2 className="text-lg font-semibold">Account Information</h2>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wide">
              Name
            </p>
            <p className="text-sm font-medium">{user.name}</p>
          </div>

          <div>
            <p className="text-xs text-white/40 uppercase tracking-wide">
              Email
            </p>
            <p className="text-sm font-medium">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-muted-background)] border border-white/5 rounded-2xl p-6">
        <button
          onClick={() => setShowLogout(true)}
          className="flex items-center gap-2 text-[var(--color-red)] hover:bg-[var(--color-red)]/10 px-4 py-2 rounded-xl transition cursor-pointer"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {showLogout && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-[var(--color-muted-background)] border border-white/5 rounded-2xl p-8 w-[340px] space-y-6">
            <h3 className="text-lg font-semibold">Confirm Logout</h3>
            <p className="text-sm text-white/60">
              Are you sure you want to log out?
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLogout(false)}
                className="px-4 py-2 rounded-xl border border-white/10 text-white/70 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-[var(--color-red)] text-white hover:opacity-90 transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
