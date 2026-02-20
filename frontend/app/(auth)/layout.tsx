import Image from 'next/image'
export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex justify-center">
            <div className="flex flex-col py-20">
                  <div className="flex items-center gap-2 mb-4">
                                  <Image
                                      src='/logo.svg'
                                      alt='Flowboard'
                                      width={30}
                                      height={30} 
                                      className="fill-foreground text-foreground"
                                  />
                                  <span className="text-muted-foreground font-bold text-lg">Flowboard</span>
                                  </div>
                {children}
            </div>
        </div>
    );
}
