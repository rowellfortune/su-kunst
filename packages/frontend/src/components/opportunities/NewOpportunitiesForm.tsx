import { ImageIcon, Film, Palette } from 'lucide-react'; // Using lucide icons
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"


function NewOpportunitiesForm() {
  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4 max-w-xl mx-auto">

      {/* Top Input Row */}
      <div className="flex items-center space-x-3">
        <a href="/settings/profile">
        <img
          src="https://github.com/shadcn.png" // replace with user avatar if available
          // alt={userData.username}
          className="w-10 h-10 rounded-full"
        />
        </a>
        <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none">
            <span>{`Create new opportunities`}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between border-t pt-2">
        <Dialog>
          <form>
            <DialogTrigger asChild>
              <Button variant="ghost"><Palette className="text-red-500 w-5 h-5" />Internship</Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-[425px]">
              <div>
                <p className='text-xl font-bold text-center'>Create post</p>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Textarea placeholder="Type your message here." />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className='text-center w-full rounded font-bold' onClick={()=> {console.log('Posted')}}></Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>

        <Dialog>
          <form>
            <DialogTrigger asChild>
              <Button variant="ghost"><ImageIcon className="text-green-500 w-5 h-5" />Post</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <div>
                <p className='text-xl font-bold text-center'>Create post</p>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Textarea placeholder="Type your message here." />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className='text-center w-full rounded font-bold' onClick={()=> {console.log('Posted')}}>Post</Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>

        <Dialog>
          <form>
            <DialogTrigger asChild>
              <Button variant="ghost"><Film className="text-pink-500 w-5 h-5" /><span>Write article</span></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <div>
                <p className='text-xl font-bold text-center'>Create post</p>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Textarea placeholder="Type your message here." />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className='text-center w-full rounded font-bold' onClick={()=> {console.log('Posted')}}>Post</Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>
    </div>
  )
}

export default NewOpportunitiesForm;
