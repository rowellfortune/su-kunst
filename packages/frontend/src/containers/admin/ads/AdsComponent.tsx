import { Link } from "react-router-dom";

type AdType = {
  pk?: string;
  title: string;
  content: string;
  attachment?: string;   
  company: string;
  link: string;
};

function AdsComponent({link, attachment, company, title, pk}: AdType) {
  console.log(link, company)
  return (
    <div className='my-3 w-full bg-slate-100 justify-center'>
      <div className=" bg-white overflow-hidden border">
        <Link className="font-bold" to={`/ads/edit/${pk}/`}>
          <img
            className="rounded-m d"
            src={attachment} // Replace with dynamic source if needed
            alt={attachment}
          />
        </Link> 
      </div>
      <div className="p-2 flex py-">
        <div className="w-1/2">
          <p className="font-light w-full text-xs"></p>
          <p className="font-bold">{title}</p>
        </div>
        <div className="w-1/2">
         <Link to={`/ads/edit/${pk}/`} className="text-xs font-bold bg-slate-300 py-1 px-2 rounded">Edit this ad</Link>
        </div>
      </div>
    </div>
  )
}

export default AdsComponent


