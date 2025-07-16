import IndexNavbar from "@/components/Navbars/IndexNavbar";

export default function Landinglayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center items-center h-screen bg-slate-100 ">
      <IndexNavbar /> 
      <main className="">
        {children}
      </main>
    </div>
  )
}