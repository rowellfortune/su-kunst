import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function AdsComponent() {
  return (
    <div className='my-3'>
      <div className="max-w-xl bg-white shadow-md overflow-hidden mx-auto">
        {/* User Info */}
        <div className="flex items-center p-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="ml-3 text-md font-semibold text-gray-900">Companis Name / Brand Name</div>
        </div>
         {/* Post Image */}
        <h5 className="px-4 text-bold text-2xl">Ads Title</h5>
        <img
          className="w-full object-cover"
          src='https://su-kunst-dev-uploadsbucket-bdzsdtdf.s3.amazonaws.com/public/posts/1750900309207-402503673147456.jpg' // Replace with dynamic source if needed
          alt="Post"
        />
      </div>
    </div>
  )
}

export default AdsComponent