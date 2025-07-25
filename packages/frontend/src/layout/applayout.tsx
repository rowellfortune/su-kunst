import { Sidebar } from "@/components/Sidebar";
import AppNavbar from "@/components/Navbars/AppNavbar";
import IndexNavbar from "@/components/Navbars/IndexNavbar";
import { RightSidebar } from "@/components/RightSidebar";
import {  useAppContext } from "@/lib/contextLib";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const {isAuthenticated } = useAppContext();

  return (
    <div className="bg-slate-100 h-vh mx-auto">
       {isAuthenticated ?  <AppNavbar /> :  <IndexNavbar />}
        <main className={`flex ${isAuthenticated ?  `px-2`  :  null} flex-col md:flex-row max-w-7xl mx-auto`}>
          {isAuthenticated && <div>
            <Sidebar/>
            </div>}
            {children}
          {isAuthenticated && <div><RightSidebar /></div> }
      </main>
    </div>
  )
}