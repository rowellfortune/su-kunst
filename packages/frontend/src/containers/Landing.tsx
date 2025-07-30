// import { FiSearch } from "react-icons/fi";

import { Card } from "@/components/ui/card"

function Landing() {
  return (
    <div
      className="relative w-full h-screen bg-center"
      style={{
        backgroundImage: "url('https://su-kunst-demo-uploadsbucket-baswcdvo.s3.amazonaws.com/public/posts/1753493093987-IMG_7706.jpeg')",
      }}
    >
      {/* Top‐left stats */}
      <Card className="absolute left-[30%] right-[30%] top-90 mx-auto space-y-4 bg-black/80 text-white md:grid-cols-3 md:grid">
        <div className="flex flex-col my-[10px] mx-[16px] text-center">
          <span className="text-4xl">164+</span>
          <span className="text-lg">Art work</span>
        </div>
        <div className="flex flex-col my-[10px] mx-[16px] text-center">
          <p className="text-4xl">283</p>
          <span className="text-lg">Opencalls</span>
        </div>
        <div className="flex flex-col my-[10px] mx-auto text-center">
          <p className="text-4xl">14</p>
          <span className="text-lg">Organization</span>
        </div>
      </Card>
    </div>
  )
}

export default Landing