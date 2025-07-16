import NewAdForm from '@/components/adsfeed/NewAdForm'

function NewAd() {
  return (
    <div className="overflow-auto">
      <h2 className="text-center text-2xl font-bold">Fill in the form the create an Ad</h2>
      <NewAdForm />
    </div>
  )
}

export default NewAd