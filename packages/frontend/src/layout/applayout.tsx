import { Sidebar } from "@/components/Sidebar";
import AppNavbar from "@/components/Navbars/AppNavbar";
import IndexNavbar from "@/components/Navbars/IndexNavbar";
import { RightSidebar } from "@/components/RightSidebar";
import {  useAppContext } from "@/lib/contextLib";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const {isAuthenticated } = useAppContext();

  return (
    <div className="bg-slate-100 h-full mx-auto">
       {isAuthenticated ?  <AppNavbar /> :  <IndexNavbar />}
        <main className={`${isAuthenticated ?  `flex md:flex-row flex-col`  :  `flex`} `}>
          {isAuthenticated && <div className="basis-3/12"><Sidebar/></div>}
            {children}
          {isAuthenticated && <div className="basis-3/12">{isAuthenticated ? <RightSidebar/> : null}</div> }
      </main>
    </div>
  )
}