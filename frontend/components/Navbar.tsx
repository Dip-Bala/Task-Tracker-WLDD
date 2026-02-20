import Image from "next/image";

export default function Navbar() {
  return (
    <div className="h-14 flex items-center px-8 py-10">
      <div className="flex items-center">
            <Image
                src='/logo.svg'
                alt='Flowboard'
                width={40}
                height={20} 
            />
            <span className="text-foreground font-bold text-lg">Flowboard</span>
            </div>
    </div>
  );
}
