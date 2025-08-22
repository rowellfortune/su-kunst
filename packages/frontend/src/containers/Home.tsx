import { useAppContext } from "../lib/contextLib";
import Post from "@/components/newsfeed/Post";
import { Skeleton } from "@/components/ui/skeleton";
import AdsComponent from "@/components/adsfeed/AdsComponent";
import OpportunitiesComponent from "@/components/opportunities/OpportunitiesComponent";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useGetPostsQuery,
  useGetAdsQuery,
  useGetOpportunitiesQuery,
} from '@/store/index'
import Landing from "./Landing";
import NewPost from "@/components/newsfeed/NewPost";

// base for all items
interface BaseItem {
  pk?: string;            // primary key (optional)
  title: string;          // always required
  attachment?: string;    // URL to an image/video (optional)
  content?: string;       // body text (optional)
  description?: string;   // extra text (optional)
  author: string;         // who created it (required)
  postedBy?: string;      // user ID who posted it (optional)
  createdAt: number;     // UNIX timestamp (optional)
  type?: string;          // a generic “type” label (optional)
  link?: string;           // always required
  entityType:            // discriminant for narrowing
    | "POST"
    | "AD"
    | "OPPORTUNITY"
    | string;
}

// a “POST” item
interface PostType extends BaseItem {
  entityType: "POST";
}

// an “AD” item
interface AdType extends BaseItem {
  entityType: "AD"; 
  company: string;
}

// an “OPPORTUNITY” item
interface OpportunityType extends BaseItem {
  entityType: "OPPORTUNITY";
  description?: string;
  company: string;
  type?: string;
}

// the union of all possible feed items
type FeedItem = PostType | AdType | OpportunityType;

export default function Home() {
  const {isAuthenticated } = useAppContext();
  // const {user} = useContext(AppContext)

  const {
    data: posts = [],
    error: postsError,
    isLoading: postsLoading,
  } = useGetPostsQuery(undefined, { skip: !isAuthenticated });

  const {
    data: ads = [],
    error: adsError,
    isLoading: adsLoading,
  } = useGetAdsQuery(undefined, { skip: !isAuthenticated });

  const {
    data: opportunities = [],
    error: oppsError,
    isLoading: oppsLoading,
  } = useGetOpportunitiesQuery(undefined, { skip: !isAuthenticated });

  // 1) Flatten & shuffle any number of arrays
  function shuffleArrays<T>(...arrays: T[][]): T[] {
    const combined = arrays.flat();
    for (let i = combined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }
    return combined;
  }

  // 2) Build a mixed feed with 1 ad after every `interval` content items
  function buildMixedFeed(
    contentItems: FeedItem[], // posts + opportunities, already shuffled
    ads: AdType[],
    interval = 3
  ): FeedItem[] {
    const adsQueue = shuffleArrays(ads);
    const feed: FeedItem[] = [];
    let shownContent = 0;

    for (const item of contentItems) {
      feed.push(item);
      shownContent++;

      if (shownContent >= interval && adsQueue.length > 0) {
        feed.push(adsQueue.shift()!);
        shownContent = 0;
      }
    }

    return feed;
  }

  // 3) Pull out the very newest post, then mix the rest + opportunities + ads
  function buildFinalFeed(
    posts: PostType[],
    opportunities: OpportunityType[],
    ads: AdType[],
    interval = 3
  ): FeedItem[] {
    if (posts.length === 0) {
      // no posts at all → just mix opps & ads
      return buildMixedFeed(shuffleArrays(opportunities), ads, interval);
    }

    // sort posts descending
    const sortedPosts = [...posts].sort((a, b) => b.createdAt - a.createdAt);
    // first item is the most recent post
    const [latestPost, ...otherPosts] = sortedPosts;

    // shuffle other content together
    const shuffledContent = shuffleArrays( otherPosts as FeedItem[],
    opportunities as FeedItem[]);

    // insert ads every `interval`
    const restFeed = buildMixedFeed(shuffledContent, ads, interval);

    // final feed: latestPost always at index 0
    return [latestPost, ...restFeed];
  }

  // Now you have a mixed feed with random order
  const feed = buildFinalFeed(posts, opportunities, ads, 3);

  function renderPostsList(feed: FeedItem[]) {
    return (
      <div className="mt-6">
        {isAuthenticated ? <NewPost/> : null }
        {feed.map((item) => {
          switch (item.entityType) {
            case 'POST':
              if (!item.content) return null;
              return  (
              <Post pk={item?.pk} 
                        key={item?.pk} 
                        title={item.title} 
                        attachment={item.attachment} 
                        content={item.content} 
                        author={item.author} 
                        userId={item.postedBy} 
                        createdAt={item.createdAt} 
                        postedBy={item.postedBy}
                      />
              // <div key={item.pk} >Post</div>
                    );
            case 'AD':
              return  (<AdsComponent pk={item.pk}  
                        key={item.pk} 
                        attachment={item.attachment} 
                        title={item.title} 
                        content={item.content}  
                        company={item?.company ?? "unknown-company"} 
                        link={item?.link ?? "#"}
                      />);
            case 'OPPORTUNITY':
              return  (<OpportunitiesComponent pk={item.pk} 
                        key={item.pk} 
                        attachment={item.attachment} 
                        title={item.title} 
                        description={item?.description} 
                        company={item?.company} 
                        type={item?.type} 
                        createdAt={item.entityType}
                      />);
            default:
              return <div> Error</div>;
          }
        })}
      </div>
    );
  }

  function renderLander() {
    return (
      <>
        <Landing />
      </>
    );
  }

  if (postsLoading && oppsLoading && adsLoading && oppsError && adsError && postsError) return (
    <div className="flex w-full flex-col md:flex-row max-w-3xl container mx-auto h-screen" >
      <div className="flex flex-col md:w-1/3">
        <Skeleton className="h-[125px] w-full md:w-[250px] rounded-xl bg-amber-300" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full md:w-[250px] bg-amber-300" />
          <Skeleton className="h-4 w-full md:w-[200px] bg-amber-300" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="space-y-2 ">
          <Skeleton className="h-4 w-full md:w-[250px] bg-amber-300" />
          <Skeleton className="h-100 w-full bg-amber-300" />
        </div>

      </div>
      <div className="flex flex-col md:w-1/3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl bg-amber-300" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full md:w-[250px] bg-amber-300" />
          <Skeleton className="h-4 w-full md:w-[200px] bg-amber-300" />
        </div>
      </div>
    </div>
  );
 
  function renderPosts() {
    return (
        <>
         {isAuthenticated ? 
        <ScrollArea className="flex flex-col md:flex-row w-full mx-auto">
          {!postsLoading && !oppsLoading && !adsLoading && !oppsError && !adsError && !postsError && renderPostsList(feed)}
        </ScrollArea>
        : null }

        </> 
    );
  }

  return (
    <>
      {isAuthenticated ? renderPosts() : renderLander()}
    </>
  );
}