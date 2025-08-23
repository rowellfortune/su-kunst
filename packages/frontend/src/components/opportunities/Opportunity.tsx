import { AppContext } from '@/lib/contextLib';
import { useContext } from 'react';
import { useParams } from 'react-router-dom'

function Opportunity() {
      const {isAuthenticated } = useContext(AppContext);
      const id = useParams();

      console.log(useParams);

      console.log(isAuthenticated)
      console.log(id)
  return (
    <div className="col-span-12">
      id {`${id.id}`}
    </div>
  )
}

export default Opportunity