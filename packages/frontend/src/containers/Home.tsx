import { useEffect, useState } from "react";
import { useAppContext } from "../lib/contextLib";
import "./Home.css";
import type { PostType } from "../types/post";
import { onError } from "../lib/errorLib";
import { API, Auth } from "aws-amplify";
import Post from "@/components/newfeed/Post";
import NewPost from "@/components/newfeed/NewPost";

type AdType = {
  title: string;
  image: string;
  url: string;
  id: string;
  clicks: number;
}

export default function Home() {
  const [posts, setPosts] = useState<Array<PostType>>([]);
  const [ads, setAds] = useState<Array<AdType>>([]);
  const { isAuthenticated } = useAppContext();
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true);

  function formatDate(str: undefined | string) {
    return !str ? "" : new Date(str).toLocaleString();
  }

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      const user = await Auth.currentAuthenticatedUser();
      setUser(user);

      try {
        const posts = await loadPosts();
        // const ads = await loadAds();
        setPosts(posts);
        setAds(ads);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  function renderPostsList(posts: PostType[]) {
    return (
      <div className="w-full">
        <NewPost userData={user} />
        {posts.map(({pk, title, content, createdAt, postedBy, author, attachment }) => (
          <div key={pk} >
            <Post title={title} pk={pk} attachment={attachment} content={content} author={author} userId={postedBy} createdAt={formatDate(createdAt)} postedBy={""}/>
          </div>
        ))}
      </div>
    );
  }

  function renderAsList(ads: AdType[]){
    return(
      <div className="w-full">
        {ads.map(({title, id}) => (
          <div key={id}>{title}</div>
        ))}
      </div>
    )
  }
  
  function loadPosts() {
    return API.get("posts", "/posts", {});
  }

  function loadAds() {
    return API.get("ads", "/ads", {});
  }

  function renderLander() {
    return (
      <div className="lander text-center">
        <h1>Scratch</h1>
        <p className="text-muted">Su-Kunst Social Plaform for Artist</p>
      </div>
    );
  }

  function renderPosts() {
    return (
      <div className="flex">
        {!isLoading && renderAsList(ads)}
        {!isLoading && renderPostsList(posts)}
        {!isLoading && renderAsList(ads)}
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderPosts() : renderLander()}
    </div>
  );
}