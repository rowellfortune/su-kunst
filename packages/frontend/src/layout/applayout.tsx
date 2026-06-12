import { Sidebar } from "@/components/Sidebar";
import AppNavbar from "@/components/Navbars/AppNavbar";
import IndexNavbar from "@/components/Navbars/IndexNavbar";
import { RightSidebar } from "@/components/RightSidebar";
import { useAppContext } from "@/lib/contextLib";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppContext();

  return (
    <div className="bg-gray-100 min-h-screen">
      {isAuthenticated ? (
        <div className="sticky top-0 z-50">
          <AppNavbar />
        </div>
      ) : (
        <IndexNavbar />
      )}

      {isAuthenticated ? (
        <div className="max-w-[1920px] mx-auto flex">
          <aside className="hidden lg:block w-[360px] shrink-0">
            <div className="sticky top-[56px] h-[calc(100vh-56px)] overflow-y-auto pt-4 pb-2 pl-2 pr-1">
              <Sidebar />
            </div>
          </aside>

          <main className="flex-1 min-w-0 pt-4 px-4">
            {children}
          </main>

          <aside className="hidden xl:block w-[360px] shrink-0">
            <div className="sticky top-[56px] h-[calc(100vh-56px)] overflow-y-auto pt-4 pb-2 pr-4 pl-1">
              <RightSidebar />
            </div>
          </aside>
        </div>
      ) : (
        <main className="flex">{children}</main>
      )}
    </div>
  );
}
