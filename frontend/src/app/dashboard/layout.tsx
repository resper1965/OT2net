"use client";

import { SidebarProvider } from "@/components/layout/SidebarProvider";
import { SidebarLayout, MainContent } from "@/components/layout/SidebarLayout";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <SidebarLayout>
        <Sidebar />
        <MainContent>
          <Header />
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </MainContent>
      </SidebarLayout>
    </SidebarProvider>
  );
}

