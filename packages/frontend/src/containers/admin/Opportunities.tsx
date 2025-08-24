import { useEffect, useState } from 'react'
import { useAppContext } from "@/lib/contextLib";
import { API, Auth } from "aws-amplify";
import { onError } from '@/lib/errorLib';


function Opportunities() {
    const [ads, setAds] = useState<Array<AdType>>([]);
    const { isAuthenticated } = useAppContext();
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true);

    console.log(ads);
    console.log(isLoading);

    function loadAds() {
      return API.get("opportunities", "/opportunities", {});
    }
  
    useEffect(() => {

      async function onLoad() {
        if (!isAuthenticated) {
          return;
        }
  
        const user = await Auth.currentAuthenticatedUser();
        setUser(user);
  
        try {
          const ads = await loadAds();
  
          setAds(ads);
        } catch (e) {
          onError(e);
        }
  
        setIsLoading(false);
      }
  
      onLoad();
    }, [isAuthenticated]);
  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {ads.map(({content,attachment, company, pk}) => (
            <div key={pk} className="justify-center">
              <div>
                {company}

                <img
                  className="rounded-m d"
                  src={attachment} // Replace with dynamic source if needed
                  alt={attachment}
                />
              </div>
              {/* <AdsComponent pk={pk} link={link} title={title} content={content} attachment={attachment} company={company}/> */}
            </div>
        ))}
      </div>
    </div>
  )
}

export default Opportunities;
