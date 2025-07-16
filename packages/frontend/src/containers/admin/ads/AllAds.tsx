import { useEffect, useState } from 'react'
import { useAppContext } from "@/lib/contextLib";
import { API, Auth } from "aws-amplify";
import { onError } from '@/lib/errorLib';
import AdsComponent from './AdsComponent';
import type { AdType } from '@/types/ad';

function AllAds() {

  const [ads, setAds] = useState<Array<AdType>>([]);
  const { isAuthenticated } = useAppContext();
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true);

  console.log(user, isLoading)

  function loadAds() {
    return API.get("ads", "/ads", {});
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
      <div className="grid grid-cols-4 gap-4">
        {ads.map(({title, pk, company, content, link, attachment}) => (
          <div key={pk} className="justify-center">
            <AdsComponent pk={pk} link={link} title={title} content={content} attachment={attachment} company={company}/>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllAds
