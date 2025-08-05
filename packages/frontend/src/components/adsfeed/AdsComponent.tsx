// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Link } from "react-router-dom";


type AdType = {
  pk?: string;
  title: string;
  content?: string;
  attachment?: string;   
  company: string;
  link: string;
};
function AdsComponent({attachment, company, title, link}: AdType) {

  return (
    <div className='mb-5'>
      <div className=" bg-white rounded-xl shadow-md overflow-hidden border mx-auto">
        <div className="flex items-center m-4">
          {/* <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar> */}
          <div className="">
            <div className="ml-3 text-md font-semibold text-gray-900">{company}</div>
            <div className="ml-3 text-xs font-light text-gray-500">Sponsored</div>
          </div>
        </div>
            
        <div>
          <Link to={link}>
            <div className=" bg-white overflow-hidden border">
              <img
                className="rounded-m w-full"
                src={attachment} // Replace with dynamic source if needed
                alt={attachment}
              />
            </div>
          </Link>
          <div className="px-2 py-3">
            <div className="flex">
              <Link to={link}>
                <p className="font-bold">{title}</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdsComponent


