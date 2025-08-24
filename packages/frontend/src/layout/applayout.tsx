import { Sidebar } from "@/components/Sidebar";
import AppNavbar from "@/components/Navbars/AppNavbar";
import IndexNavbar from "@/components/Navbars/IndexNavbar";
import { RightSidebar } from "@/components/RightSidebar";
import {  useAppContext } from "@/lib/contextLib";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const {isAuthenticated } = useAppContext();

  return (
    <div className="bg-slate-100 h-screen mx-auto">
       {isAuthenticated ?  <AppNavbar /> :  <IndexNavbar />}
        <main className={`${isAuthenticated ?  `flex md:flex-row flex-col`  :  `flex`} `}>
          {isAuthenticated && <div className="basis-3/12"><Sidebar/></div>}
            {children}
          {isAuthenticated && <div className="basis-3/12">{isAuthenticated ? <RightSidebar/> : null}</div> }
      </main>
      {/* <div className="flex md:flex-row flex-col w-full">
        <div className="md:basis-3/12 basis-full bg-amber-800 md:mx-6">01</div>
        <div className="md:basis-6/12 basis-full bg-sky-700">02</div>
        <div className="md:basis-3/12 hidden bg-green-600 mx-6">02</div>
      </div> */}
    </div>
  )
}