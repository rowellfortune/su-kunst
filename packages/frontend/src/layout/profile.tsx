import AppNavbar from "@/components/Navbars/AppNavbar";
import IndexNavbar from "@/components/Navbars/IndexNavbar";
import {  useAppContext } from "@/lib/contextLib";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const {isAuthenticated } = useAppContext();
  return (
    <div className="bg-slate-100 h-vh">
       {isAuthenticated ?  <AppNavbar /> :  <IndexNavbar />}
        <main className={`flex ${isAuthenticated ?  `px-2`  :  null} flex-col md:flex-row w-full mx-auto`}>
        {children}
      </main>
    </div>
  )
}