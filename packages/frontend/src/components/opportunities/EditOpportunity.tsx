import { AppContext } from '@/lib/contextLib';
import { useState, useEffect, useContext } from "react";
import { useParams} from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "@/lib/errorLib"

function Opportunity() {

  const {isAuthenticated } = useContext(AppContext);
  const {id} = useParams();
  const [note, setNote] = useState(null);


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

    if(isAuthenticated){
      onLoad();
    }
   
  }, [id, isAuthenticated]);


  return (
    <div className="pt-6 flex w-full col-span-12 flex-col md:flex-row max-w-3xl container mx-auto h-screen" >
      <div className='flex flex-col'>
      {isAuthenticated ? <div> id {`${id}`} </div>: null }
      
      </div>
    </div>
  )
}

export default Opportunity;