import IndexNavbar from "@/components/Navbars/IndexNavbar";

export default function Landinglayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh w-full bg-slate-100 items-center justify-center p-6 md:p-10">
      <IndexNavbar /> 
      <div className="w-full max-w-sm">
        {children}
      </div>
    </div>
  )
}