import { Share} from 'lucide-react'
import { Button } from '../ui/button'

function ShareCompnent() {
  return (
    <>
        <Button variant="ghost" className='flex justify-between rounded'>
            <Share  className='w-5 h-5'/> 0 Share
        </Button>
    </>
  )
}

export default ShareCompnent