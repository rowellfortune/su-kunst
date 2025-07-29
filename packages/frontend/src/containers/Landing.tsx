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
          <p className="text-4xl">283<span className="text-2xl"></span></p>
          <span className="text-lg">Opencalls</span>
        </div>
        <div className="flex flex-col my-[10px] mx-auto text-center">
          <p className="text-4xl">14+ <span className="text-2xl"></span></p>
          <span className="text-lg">Organization</span>
        </div>
      </Card>

      {/* Right‐hand panel */}
      <div className="absolute top-42 hidden right-8 w-72 p-4 bg-white bg-opacity-80 rounded-lg shadow">
        <h3 className="font-semibold mb-2">Su-Kunst</h3>
        <ul className="text-gray-800 space-y-1">
          <li>Talk</li>
          <li>Rewards</li>
          <li>Brave VPN</li>
        </ul>
        <button className="mt-4 w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          Start free trial
        </button>
      </div>

      {/* Bottom‐center search bar */}
      {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 max-w-md">
        <div className="flex items-center bg-white bg-opacity-90 rounded-full overflow-hidden shadow-md">
          <input
            type="text"
            placeholder="Search the web privately"
            className="flex-grow px-4 py-2 focus:outline-none"
          />
          <button className="p-3">
            <FiSearch size={20} />
          </button>
        </div>
      </div> */}
    </div>
  )
}

export default Landing