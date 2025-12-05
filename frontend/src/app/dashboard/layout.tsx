import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Sidebar />
      <main className="lg:pl-64 min-h-screen">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}

