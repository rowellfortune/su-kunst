import { useEffect, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../lib/contextLib";
import "./Home.css";
import type { NoteType } from "../types/post";
import { onError } from "../lib/errorLib";
import { API } from "aws-amplify";
import { BsPencilSquare } from "react-icons/bs";
import Post from "@/components/newfeed/Post";


export default function Home() {
  const [notes, setNotes] = useState<Array<NoteType>>([]);
  console.log(notes)
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  function formatDate(str: undefined | string) {
    return !str ? "" : new Date(str).toLocaleString();
  }

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const notes = await loadNotes();
        setNotes(notes);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);


  function renderNotesList(notes: NoteType[]) {
    return (
      <>
        <a href="/notes/new">
          <ListGroup.Item action className="py-3 text-nowrap text-truncate">
            <BsPencilSquare size={17} />
            <span className="ms-2 fw-bold">Create a new note</span>
          </ListGroup.Item>
        </a>
        {notes.map(({pk, title, description, createdAt, postedBy }) => (
          <div key={pk} >
            <Post title={title} description={description} user={postedBy} createdAt={formatDate(createdAt)}/>
            {/* <a href={`/notes/${sk}`} className="text-nowrap text-truncate">    
              <span className="fw-bold"></span>
              <span className="fw-bold">{title}</span>
              <br />
              <span className="text-muted">
                Created: {formatDate(createdAt)}
              </span>
            </a> */}
          </div>
        ))}
      </>
    );
  }
  
  function loadNotes() {
    return API.get("notes", "/notes", {});
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
      <div className="notes">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Notes</h2>
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