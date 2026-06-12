import { useMemo, useCallback, useRef, useEffect, useState } from "react";
import { useAppContext } from "../lib/contextLib";
import Post from "@/components/newsfeed/Post";
import { Skeleton } from "@/components/ui/skeleton";
import AdsComponent from "@/components/adsfeed/AdsComponent";
import OpportunitiesComponent from "@/components/opportunities/OpportunitiesComponent";
import {
  useGetPostsQuery,
  useGetAdsQuery,
  useGetOpportunitiesQuery,
} from '@/store/index';
import Landing from "./Landing";
import NewPost from "@/components/newsfeed/NewPost";

interface BaseItem {
  pk?: string;
  title: string;
  attachment?: string;
  content?: string;
  description?: string;
  author: string;
  postedBy?: string;
  createdAt: number;
  type?: string;
  link?: string;
  entityType: "POST" | "AD" | "OPPORTUNITY" | string;
}

interface PostType extends BaseItem {
  entityType: "POST";
}

interface AdType extends BaseItem {
  entityType: "AD";
  company: string;
}

interface OpportunityType extends BaseItem {
  entityType: "OPPORTUNITY";
  description?: string;
  company: string;
  type?: string;
}

type FeedItem = PostType | AdType | OpportunityType;

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function buildMixedFeed(
  contentItems: FeedItem[],
  ads: AdType[],
  seed: number,
  interval = 3
): FeedItem[] {
  const adsQueue = [...seededShuffle(ads, seed)];
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

export default function Home() {
  const { isAuthenticated } = useAppContext();

  const [cursor, setCursor] = useState<string | undefined>(undefined);

  const {
    data: postsData,
    error: postsError,
    isLoading: postsLoading,
    isFetching: postsFetching,
  } = useGetPostsQuery(cursor, { skip: !isAuthenticated });

  const posts = postsData?.items ?? [];
  const nextCursor = postsData?.nextCursor ?? null;

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

  // Stable seed per session so the feed order doesn't jump on re-renders
  const shuffleSeed = useMemo(() => Date.now(), []);

  const feed = useMemo(() => {
    if (posts.length === 0) {
      return buildMixedFeed(
        seededShuffle(opportunities as FeedItem[], shuffleSeed),
        ads as AdType[],
        shuffleSeed
      );
    }

    const sortedPosts = [...posts].sort((a, b) => b.createdAt - a.createdAt);
    const [latestPost, ...otherPosts] = sortedPosts;

    const shuffledContent = seededShuffle(
      [...(otherPosts as FeedItem[]), ...(opportunities as FeedItem[])],
      shuffleSeed
    );

    const restFeed = buildMixedFeed(shuffledContent, ads as AdType[], shuffleSeed);
    return [latestPost, ...restFeed];
  }, [posts, ads, opportunities, shuffleSeed]);

  // Infinite scroll observer
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!nextCursor || postsFetching) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCursor(nextCursor);
        }
      },
      { rootMargin: "400px" }
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [nextCursor, postsFetching]);

  const loadMore = useCallback(() => {
    if (nextCursor && !postsFetching) {
      setCursor(nextCursor);
    }
  }, [nextCursor, postsFetching]);

  if (!isAuthenticated) return <Landing />;

  const isInitialLoad = postsLoading || oppsLoading || adsLoading;

  if (isInitialLoad) {
    return (
      <div className="mt-6 w-full col-span-12 flex-col md:flex-row max-w-3xl container mx-auto h-full">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex bg-white shadow-md p-3 mb-5 rounded-xl flex-col md:w-full">
            <div className="flex space-y-2 my-2 items-center">
              <Skeleton className="h-13 rounded-full w-13 bg-slate-300" />
              <div className="mx-2">
                <Skeleton className="h-4 w-full md:w-[200px] bg-slate-300 my-2" />
                <Skeleton className="h-4 w-full md:w-[100px] bg-slate-300 my-2" />
              </div>
            </div>
            <Skeleton className="h-62 w-full rounded-xl bg-slate-300" />
            <div className="flex space-y-2 my-2">
              <Skeleton className="h-5 w-20 bg-slate-300 mr-2" />
              <Skeleton className="h-5 w-20 bg-slate-300" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (postsError || adsError || oppsError) {
    return (
      <div className="mt-6 w-full max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <p className="text-red-500 font-medium">Something went wrong loading the feed.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[680px] mx-auto">
      <div className="mt-6">
        <NewPost />
        {feed.map((item) => {
          switch (item.entityType) {
            case 'POST':
              if (!item.content) return null;
              return (
                <Post
                  pk={item?.pk}
                  key={item?.pk}
                  title={item.title}
                  attachment={item.attachment}
                  content={item.content}
                  author={item.author}
                  userId={item.postedBy}
                  createdAt={item.createdAt}
                  postedBy={item.postedBy}
                />
              );
            case 'AD':
              return (
                <AdsComponent
                  pk={item.pk}
                  key={item.pk}
                  attachment={item.attachment}
                  title={item.title}
                  content={item.content}
                  company={(item as AdType)?.company ?? "unknown-company"}
                  link={item?.link ?? "#"}
                />
              );
            case 'OPPORTUNITY':
              return (
                <OpportunitiesComponent
                  pk={item.pk}
                  key={item.pk}
                  attachment={item.attachment}
                  title={item.title}
                  description={(item as OpportunityType)?.description}
                  company={(item as OpportunityType)?.company}
                  type={item?.type}
                  createdAt={item.entityType}
                />
              );
            default:
              return null;
          }
        })}

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="h-1" />

        {postsFetching && (
          <div className="flex justify-center py-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          </div>
        )}

        {!nextCursor && posts.length > 0 && (
          <p className="text-center text-gray-400 text-sm py-6">You're all caught up</p>
        )}

        {nextCursor && !postsFetching && (
          <button
            onClick={loadMore}
            className="w-full py-3 text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
            Load more
          </button>
        )}
      </div>
    </div>
  );
}
