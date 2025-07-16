import { useParams } from 'react-router-dom';

function UpdateAd() {
    const { id } = useParams();

  return (
    <div className="flex w-full md:max-w-5xl container mx-auto">
        <h2>Ad ID: {id}</h2>
        UpdateAd
    </div>
  )
}

export default UpdateAd