"use client"
import Image from "next/image";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen px-8 py-6">
            {/* <div className="flex items-center">
            <Image
                src='/logo.svg'
                alt='Flowboard'
                width={60}
                height={20} 
            />
            <span className="text-[#243E36] font-extrabold text-lg">Flowboard</span>
            </div> */}

            <div className="flex flex-col items-center justify-center p-6 rounded-lg shadow-md ">
                {children}
            </div>
        </div>
    );
}
// #F1F7ED - bg
// #243E36 -dark green
// #7CA982 - green
// #E0EEC6 -light green
// #C2A83E - yellow