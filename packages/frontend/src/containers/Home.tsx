import { useEffect, useState } from "react";
import { useAppContext } from "../lib/contextLib";
import "./Home.css";
import type { PostType } from "../types/post";
import { onError } from "../lib/errorLib";
import { API, Auth } from "aws-amplify";
import Post from "@/components/newfeed/Post";
import NewPost from "@/components/newfeed/NewPost";

export default function Home() {
  const [notes, setNotes] = useState<Array<PostType>>([]);
  const { isAuthenticated } = useAppContext();
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true);

  console.log(user)

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
        const notes = await loadPosts();
        setNotes(notes);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);


  function renderNotesList(notes: PostType[]) {
    return (
      <>
        <NewPost userData={user} />
        {notes.map(({pk, title, content, createdAt, postedBy, author, attachment }) => (
          <div key={pk} >
            <Post title={title} pk={pk} attachment={attachment} content={content} author={author} userId={postedBy} createdAt={formatDate(createdAt)} postedBy={""}/>
          </div>
        ))}
      </>
    );
  }
  
  function loadPosts() {
    return API.get("posts", "/posts", {});
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p className="text-muted">A simple note taking app</p>
      </div>
    );
  }

  function renderNotes() {
    return (
      <div className="notes mt-4 pb-3 mb-3">
        {!isLoading && renderNotesList(notes)}
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}