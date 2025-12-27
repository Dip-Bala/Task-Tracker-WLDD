"use client";


import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { api } from "../../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BaseSchema } from "../register/page";
import { useRouter } from "next/navigation";

const LoginSchema = BaseSchema.pick({
    email: true,
    password: true
});

export type LoginValuesType = z.infer<typeof LoginSchema>;

export default function Page() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const {
        register,
        handleSubmit
    } = useForm<LoginValuesType>();

    const mutation = useMutation({
        mutationFn: (data: LoginValuesType) => {
            return api.post('/auth/login', data);
        },
        onSuccess: (res) => {
            console.log("User Logged in successfully");
            queryClient.setQueryData(["me"], res.data.user);
            router.push('/dashboard');
        },
        onError: (error) => {
            console.error(error);
        }
    })
    const onSubmit: SubmitHandler<LoginValuesType> = async (data) => {
        mutation.mutate(data);
    }
    return <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col bg-white w-lg rounded-md items-center justify-center gap-4">
        <div className="flex text-zinc-700 gap-4 items-center" >
            <label>Email</label>
            <input {...register('email')} className="border rounded-md px-2 py-1 border-zinc-400" />
        </div>
        <div className="flex text-zinc-700 gap-4 items-center" >
            <label>Password</label>
            <input {...register('password')} className="border rounded-md px-2 py-1 border-zinc-400" />
        </div>
        <input type='submit' className="border rounded-md px-2 py-1 bg-black" />
    </form>
}


