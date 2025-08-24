import { AppContext } from '@/lib/contextLib';
import { useContext } from 'react';
import { useParams } from 'react-router-dom'

function Opportunity() {
  const {isAuthenticated } = useContext(AppContext);
  const id = useParams();

  return (
    <div className="col-span-12">
      {isAuthenticated ? <div> id {`${id.id}`} </div>: null }
    </div>
  )
}

export default Opportunity;