"use client";

import { useRouter } from "next/navigation";
import { api } from "../app/lib/api";
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();

  const logout = async () => {
    await api.post("/auth/logout");
    router.push("/login");
  };

  return (
    <div className="h-14 flex items-center px-6 py-8 ">
      <div className="flex items-center">
            <Image
                src='/logo.svg'
                alt='Flowboard'
                width={40}
                height={20} 
            />
            <span className="text-[#243E36] font-bold text-lg">Flowboard</span>
            </div>
    </div>
  );
}
