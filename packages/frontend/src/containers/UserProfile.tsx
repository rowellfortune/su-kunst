import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AppContext} from '@/lib/contextLib';
import { useGetPostsQuery, useGetUserQuery } from '@/store';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import Post from '@/components/newsfeed/Post';
import { Separator } from '@/components/ui/separator';
import Reactions from '@/components/reactions/Reactions';
import Comment from '@/components/reactions/Comments';
import ShareCompnent from '@/components/reactions/Share';
import { Bookmark, House } from 'lucide-react';
import { formatDistanceToNowStrict } from 'date-fns';
import { API } from 'aws-amplify';
import { onError } from '@/lib/errorLib';
import { Skeleton } from '@/components/ui/skeleton';

import { Globe } from 'lucide-react';

import FollowButton from '@/components/FollowButton';

export interface Post {
  id: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  timestamp: string;        // e.g. "2 hrs"
  content: string;
  imageUrl?: string;
}

export interface ProfilePageProps {
  coverUrl: string;
  avatarUrl: string;
  name: string;
  headline?: string;        // e.g. "Software engineer • Suriname"
  photos: string[];         // list of URLs
  posts: Post[];
  createdAt: 1751015236574
  email: string;
  entityType: string;
  pk: string
  profile: {
    bio: string;
    avatarFileattachment: string;   // string | undefined
    coverFileattachment: string;    // string | undefined
    website: string;
    location: string;
  }
  role: string;
  sk: string;
  username: string;
}

function UserProfile() {
  const {isAuthenticated } = useContext(AppContext);
  const id = useParams();
  const [profile, setProfile] = useState<ProfilePageProps | null>(null)

  // 🔥 Pass userId here, not undefined
  const effectiveId = id.id ?? "";
  const {
    data: userInfo,
    error: userInfoError,
    isLoading: userInfoLoading,
  } = useGetUserQuery(effectiveId, { skip: !isAuthenticated || !effectiveId });


  console.log(userInfo)
  console.log(userInfoError)
  console.log(userInfoLoading)
  const avatarUrl   = userInfo?.profile?.avatarFileattachment;
  

  const {
    data: posts = [],
    error: postsError,
    isLoading: postsLoading,
  } = useGetPostsQuery(undefined, { skip: !isAuthenticated });


  useEffect(() => {
    function loadNote() {
      return API.get("users", `/users/${id?.id}`, {});
    }

    async function onLoad() {
      try {
        const profile = await loadNote();
        setProfile(profile)
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id.id]);

  const follow = () => {

  }

  const myPosts = posts.filter((post) => post.postedBy === `${id.id}`);

  if (postsLoading) return( 
    <>
      <Skeleton className="relative h-64">
        <Skeleton className="w-full h-full object-cover bg-black"/>
        <Skeleton className="absolute left-6 bottom-0 transform translate-y-1/2 z-50">
          <Skeleton className="h-32 w-32 rounded-b-full bg-slate-950">
            <Skeleton className="bg-amber-400 text-8xl"></Skeleton>
          </Skeleton>
        </Skeleton>
      </Skeleton>
      <Skeleton className='w-full h-screen bg-amber-100' />
      <Skeleton className='w-full h-screen bg-amber-100' />
      <Skeleton className='w-full h-screen bg-amber-100' />
    </>
  );

  if (postsError)   return(
    <>
      <Skeleton className="relative h-64">
        <Skeleton className="w-full h-full object-cover bg-black"/>
        <Skeleton className="absolute left-6 bottom-0 transform translate-y-1/2 z-50">
          <Skeleton className="h-32 w-32 rounded-b-full bg-slate-950">
            {/* <AvatarImage src="/avatar.jpg" alt="Jakob Botosh" /> */}
            <Skeleton className="bg-amber-400 text-8xl"></Skeleton>
          </Skeleton>
        </Skeleton>
      </Skeleton>
      <Skeleton className='w-full h-screen bg-amber-100' />
      <Skeleton className='w-full h-screen bg-amber-100' />
      <Skeleton className='w-full h-screen bg-amber-100' />
    </>
  );
  
    return (
    <div className="md:mx-auto md:mx-w-3xl md:w-7xl">
      <div className="relative h-64 rounded-md">
        {profile?.profile?.coverFileattachment
        ? 
        <img
          src={profile?.profile?.coverFileattachment}
          alt="Cover"
          className="w-full h-full object-cover rounded-xl"
        /> 
        :
        <img
          src={`https://placehold.co/600x400?text=${profile?.username}`}
          alt={profile?.username}
          className="w-full h-full object-cover rounded-md"
        />
        }
        <div className='md:px-10 md:grid md:grid-cols-24 md:gap-4 md:items-center justify-center'>
          <Avatar className="h-42 w-42 bg-white -mt-16 col-span-5 justify-center">
            {profile && <AvatarImage className="h-42 w-42" src={profile?.profile?.avatarFileattachment} alt={profile?.username} />}
            <AvatarFallback className="bg-amber-400 text-8xl">{profile?.username[0]}</AvatarFallback>
          </Avatar>
          <div className='col-span-10 md:text-start text-center'>
            <p className='text-3xl font-bold'>{profile?.username}</p>
            <p>0 Followers . 0 following</p>
          </div>
          <div className='col-span-8 col-end-24 justify-end md:text-center py-5'>
            <FollowButton targetId={id} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      {/* <ScrollArea className="w-full mx-auto"> */}
      <div className="mx-auto md:py-8 py-3 grid grid-cols-1 lg:grid-cols-3 md:gap-8 gap-2 md:mt-32 mt-60">

        {/* Left Sidebar */}
        <aside className="md:space-y-6">
          {/* Intro */}
          <section className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-3">Intro</h2>
            <p className="text-gray-700">{profile?.profile?.bio ? <>{profile?.profile?.bio}</> : <>[Your intro goes here]</>}</p>
            <div className='flex py-2' >{profile?.profile?.location ? <><House color='#333'/><p className='px-2'>{profile?.profile?.location}</p></>: null }</div> 
            <div className='flex py-2' >{profile?.profile?.website ? <><Globe color='#333'/><p className='px-2'>{profile?.profile?.website}</p></>: null }</div> 
          </section>
        </aside>

        {/* Feed */}
        <main className="lg:col-span-2 space-y-6">
          {myPosts.map((p) => (
            <div key={p.pk} className="bg-white rounded-xl shadow-md overflow-hidden border mx-auto my-3">

              <div className="flex items-center m-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={avatarUrl} alt="Jakob Botosh" />
                  <AvatarFallback>{p.author?.[0]}</AvatarFallback>
                </Avatar>
              
                <div className="">
                  <div className="ml-3 text-md font-semibold text-gray-900">{p.author}</div>
                  <div className="ml-3 text-xs font-light text-gray-500">{formatDistanceToNowStrict(new Date(p.createdAt), { addSuffix: true })}</div>
                </div>
              </div>

              <div className="p-3 my-2 text-sm">{p.content}</div>
              
              <div className="px-3">
                <img
                  className="rounded-m w-full"
                  src={p.attachment} // Replace with dynamic source if needed
                  alt={p.attachment}
                />
              </div>

              <Separator className="my-4 " />

              <div className="flex justify-between items-center mx-3 pb-4 text-gray-600 text-sm">
                <div className="flex space-x-0 justify-between">
                  <div className="flex items-center">
                    {isAuthenticated ? <Reactions postId={p.pk} /> : null}
                  </div>
                  <div className="flex items-center">
                    {isAuthenticated ? <Comment author={p.author} pk={p.pk} userId={p.userId} postId={p.pk} /> : null}
                  </div>
                  <div className="flex items-center">
                    <ShareCompnent />
                  </div>
                  {/* <div className="flex items-center">
                    {user?.username === author ? <><EditPost author={author} title={''} pk={pk}/></> : null }
                  </div>
                  <div className="flex items-center">
                    {user?.username === author ? <><Trash2 className="text-xl w-4 h-4 cursor-pointer"/></> : null }
                  </div> */}
                </div>
                <Bookmark className="text-xl w-4 h-4 cursor-pointer"/>
              </div>

            </div>
          ))}

        </main>
      </div>
      {/* </ScrollArea> */}
    </div>
  );
}

export default UserProfile

