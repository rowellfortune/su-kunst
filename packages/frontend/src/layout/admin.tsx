import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function Admin({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider 
      style={
        {
          "--sidebar-width": "200px",
        } as React.CSSProperties
      }
    >
      <AdminSidebar />
      <main className="flex flex-1 flex-col gap-4 p-4">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}