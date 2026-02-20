import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background md:grid md:grid-cols-[16rem_1fr]">
      <Sidebar />
      <div className="overflow-y-auto pb-16 md:pb-0">
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
