import { AppContext } from '@/lib/contextLib';
import React, { useRef, useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "@/lib/errorLib"

function Opportunity() {

  const {isAuthenticated } = useContext(AppContext);
  const file = useRef<null | File>(null)
  const {id} = useParams();
  const nav = useNavigate();
  const [note, setNote] = useState(null);
  const [content, setContent] = useState("");

  console.log(note)

  useEffect(() => {
    function loadNote() {
      return API.get("opportunities", `/opportunities/${id}`, {});
    }

    async function onLoad() {
      try {
        const note = await loadNote();
        const { content, attachment } = note;

        if (attachment) {
          note.attachmentURL = await Storage.vault.get(attachment);
        }

        setContent(content);
        setNote(note);
      } catch (e) {
        onError(e);
      }
    }

    if(isAuthenticated){
      onLoad();
    }
   
  }, [id, isAuthenticated]);


  return (
    <div className="pt-6 flex w-full col-span-12 flex-col md:flex-row max-w-3xl container mx-auto h-screen" >
      <div className='flex flex-col'>
      {/* {isAuthenticated ? <div> id {`${id}`} </div>: null } */}
      <h1 className='text-xl font-bold'>{note?.title}</h1>
      <img src={note?.attachment} />
      <p>{note?.description}</p>
      </div>
    </div>
  )
}

export default Opportunity;