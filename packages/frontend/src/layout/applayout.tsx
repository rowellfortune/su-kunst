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
        <main className={`${isAuthenticated ?  `grid grid-cols-24 gap-2`  :  `flex`} `}>
          {isAuthenticated && <div className="col-span-5"><Sidebar/></div>}
            {children}
          {isAuthenticated && <div className="col-span-5"><RightSidebar/></div> }
      </main>
    </div>
  )
}