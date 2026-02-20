"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../lib/api";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import Link from "next/link";

export const BaseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignUpValuesType = z.infer<typeof BaseSchema>;


export default function Page() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignUpValuesType>({
    resolver: zodResolver(BaseSchema),
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn: (data: SignUpValuesType) => api.post("/auth/signup", data),
    onSuccess: () => {
      router.push("/login");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit: SubmitHandler<SignUpValuesType> = (data) => {
    mutation.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-sm rounded-2xl px-6 py-8 bg-muted-background border border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.25)]"
    >
      <div className="">
        <p className="text-foreground font-medium text-lg flex gap-2">
        <LogIn  />
        <span>Register</span>
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <label>Name</label>
        <input
          {...register("name")}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 placeholder:text-white/30 focus:outline-none focus:border-indigo focus:ring-1 focus:ring-indigo transition"
        />
        {errors.name && (
          <p className="text-sm text-red">{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label>Email</label>
        <input
          {...register("email")}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 placeholder:text-white/30 focus:outline-none focus:border-indigo focus:ring-1 focus:ring-indigo transition"
        />
        {errors.email && (
          <p className="text-sm text-red">{errors.email.message}</p>
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
        {mutation.isPending ? "Creating account..." : "Sign Up"}
      </button>
      <p className="text-sm text-center mt-2">
        Already have an account?{" "}
        <Link href="/login" className="text-foreground font-medium hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}
