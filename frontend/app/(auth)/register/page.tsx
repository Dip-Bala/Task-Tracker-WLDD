"use client";


import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { api } from "../../lib/api";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const BaseSchema = z.object({
    name: z.string().min(1),
    email: z.email(),
    password: z.string().min(6).max(20)
})

const SignUpSchema = BaseSchema;

export type SignUpValuesType = z.infer<typeof SignUpSchema>;

export default function Page() {
    const router = useRouter();
    const {
        register,
        handleSubmit
    } = useForm<SignUpValuesType>();

    const mutation = useMutation({
        mutationFn: (data: SignUpValuesType) => {
            return api.post('/auth/register', data);
        },
        onSuccess: () => {
            router.push('/login')
        },
        onError: (error) => {
            console.error(error);
        }
    })
    const onSubmit: SubmitHandler<SignUpValuesType> = async (data) => {
        mutation.mutate(data);
    }
    return <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col rounded-md items-center justify-center gap-4">
        <div className="flex text-zinc-700 gap-4 items-center" >
            <label>Name</label>
            <input {...register('name')} className="border rounded-md px-2 py-1 border-zinc-400" />
        </div>
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


