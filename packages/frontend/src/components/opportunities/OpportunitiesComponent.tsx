import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import type { OpportunityType } from "@/types/opportunity";

function OpportunitiesComponent({title, pk, type, description, company, attachment, createdAt}: OpportunityType) {
  return (
    <div className='mb-5'>
      <div className="bg-white rounded-xl shadow-md overflow-hidden border mx-auto">
        <div className="flex items-center m-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="">
            <div className="ml-3 text-md font-semibold text-gray-900">{company}</div>
            <div className="ml-3 text-xs font-light text-gray-500">{type}</div>
          </div>
        </div>
        <div className='w-full'>
          <div className="p-2">{description}</div>
          <a href={`/opportunities/${pk}`}>
            <div className=" bg-white overflow-hidden">
            
              <img
                className="rounded-m w-full"
                src={attachment} // Replace with dynamic source if needed
                alt={attachment}
              />
              <div className="p-2">
              <p className="font-bold">{company}</p>
              <p className="font-bold">{title}</p>
              <p>{createdAt}</p>
              </div>
            </div>
          </a> 
        </div>
      </div>
    </div>
  )
}

export default OpportunitiesComponent