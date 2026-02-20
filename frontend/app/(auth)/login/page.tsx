"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";
import { z } from "zod";
import { api } from "../../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LogIn } from "lucide-react";
import { BaseSchema } from "../signup/page";
import Link from "next/link";
import ErrorAlert from "@/components/ErrorAlert";
import { useState } from "react";

const LoginSchema = BaseSchema.pick({
  email: true,
  password: true,
});

export type LoginValuesType = z.infer<typeof LoginSchema>;

export default function Page() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginValuesType>({
    resolver: zodResolver(LoginSchema),
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: (data: LoginValuesType) => api.post("/auth/login", data),
    onSuccess: (res) => {
      // console.log(res.data.message)
      queryClient.setQueryData(["me"], res.data.user);
      window.location.href = "/dashboard";
    },
    onError: (err: unknown) => {
      const axiosError = err as AxiosError<{ message?: string }>;
      const message =
        axiosError.response?.data?.message ||
        "Something went wrong. Please try again.";
      setError(message);
    },
  });

  const onSubmit: SubmitHandler<LoginValuesType> = (data) => {
    mutation.mutate(data);
  };

  return (
    <>
     {error && (
  <ErrorAlert
    message={error}
    onClose={() => setError(null)}
  />
)}

    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-sm rounded-2xl px-6 py-8 bg-muted-background  border border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.25)]"
    >
      <div className="flex items-center gap-2 text-foreground font-medium text-lg">
        <LogIn />
        <span>Login</span>
      </div>

      <div className="flex flex-col gap-1">
        <label>Email</label>
        <input
          {...register("email")}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 placeholder:text-white/30 focus:outline-none focus:border-indigo focus:ring-1 focus:ring-indigo transition"
        />
        {errors.email && (
          <p className="text-sm text-[var(--color-red)]">{errors.email.message}</p>
        )}
      </div>


      <div className="flex flex-col gap-1">
        <label>Password</label>
        <input
          type="password"
          {...register("password")}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 placeholder:text-white/30 focus:outline-none focus:border-indigo focus:ring-1 focus:ring-indigo transition"
        />
        {errors.password && (
          <p className="text-sm text-red">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!isValid || mutation.isPending}
        className={`rounded-md px-4 py-2 transition-all
          ${
            isValid
              ? "bg-indigo text-white cursor-pointer"
              : "bg-indigo/70 text-white/70 cursor-pointer"
          }
        `}
      >
        {mutation.isPending ? "Logging in..." : "Login"}
      </button>
      <p className="text-sm text-center mt-2">
        Don’t have an account?{" "}
        <Link href="/signup" className="text-foreground font-medium hover:underline cursor-pointer">
          Sign Up
        </Link>
      </p>
    </form>
    </>
  );
}
