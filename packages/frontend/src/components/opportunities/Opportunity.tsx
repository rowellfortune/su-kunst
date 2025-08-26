import { AppContext } from '@/lib/contextLib';
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "@/lib/errorLib"
import type { OpportunityType } from '@/types/opportunity';

function Opportunity() {

  const {isAuthenticated } = useContext(AppContext);
  const {id} = useParams();
  const [note, setNote] = useState<OpportunityType>();

  console.log(note)

  useEffect(() => {
    function loadNote() {
      return API.get("opportunities", `/opportunities/${id}`, {});
    }

    async function onLoad() {
      try {
        const note = await loadNote();
        const { attachment } = note;

        if (attachment) {
          note.attachmentURL = await Storage.vault.get(attachment);
        }

        setNote(note);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id,isAuthenticated]);


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