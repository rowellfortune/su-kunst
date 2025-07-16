import { Sidebar } from "@/components/LandingSidebar";
import AppNavbar from "@/components/Navbars/AppNavbar";
import IndexNavbar from "@/components/Navbars/IndexNavbar";
import { ProfileCard } from "@/components/ProfileCard";
import { RightSidebar } from "@/components/RightSidebar";
import {  useAppContext } from "@/lib/contextLib";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const {isAuthenticated } = useAppContext();
  return (
    <div className="bg-slate-100">
       {isAuthenticated ?  <AppNavbar /> :  <IndexNavbar />}
     
 
        <main className={`flex ${isAuthenticated ?  `px-2`  :  null} flex-col md:flex-row w-full mx-auto`}>
      
     
         {isAuthenticated && <div>
          <ProfileCard />
          <Sidebar />
        </div> }
        {children}
        {isAuthenticated && <div>
          <RightSidebar />
        </div> }
      </main>
    </div>
  )
}