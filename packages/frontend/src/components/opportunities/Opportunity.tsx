import { AppContext } from '@/lib/contextLib';
import { useContext } from 'react';
import { useParams } from 'react-router-dom'

function Opportunity() {
  const {isAuthenticated } = useContext(AppContext);
  const id = useParams();

  return (
    <div className="pt-6 flex w-full col-span-12 flex-col md:flex-row max-w-3xl container mx-auto h-screen" >
      {isAuthenticated ? <div> id {`${id.id}`} </div>: null }
    </div>
  )
}

export default Opportunity;