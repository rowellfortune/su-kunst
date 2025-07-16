import {
  Image as ImageIcon,
  Palette,
  Film,
} from "lucide-react";
// import { ImageIcon, Film, Palette } from 'lucide-react'; // Using lucide icons
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { API } from 'aws-amplify';
import { s3Upload } from '@/lib/awsLib';
import { onError } from '@/lib/errorLib';
import config from "@/config";
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext, useAppContext} from '@/lib/contextLib';
import type { PostType } from '@/types/post';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DialogTitle } from '@radix-ui/react-dialog';

const NewPost = () => {
    const file = useRef<null | File>(null);
    const nav = useNavigate();
    const [title, setTitle] = useState("");
    const {isAuthenticated } = useAppContext();
    const {user} = useContext(AppContext)
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    console.log(user?.username, ': Username')
  
    function createPost(note: PostType) {
      return API.post("posts", "/posts", {
        body: note,
      });
    }
  
    useEffect(() => {
      setIsLoading(true);
      async function onLoad() {
        if (!isAuthenticated) {
          return;
        }
        setAuthor(user?.username);
         console.log(user?.username, ': Username')
        setIsLoading(false);
      }

  
      onLoad();
    }, [isAuthenticated, user]);
  
    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
      if ( event.currentTarget.files === null ) return
      file.current = event.currentTarget.files[0];
    }
    
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
  
      if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
        alert(
          `Please pick a file smaller than ${
            config.MAX_ATTACHMENT_SIZE / 1000000
          } MB.`
        );
        return;
      }
  
      setIsLoading(true);
  
      try {
        const attachment = file.current
          ? await s3Upload(file.current)
          : undefined;
  
        await createPost({
          title,
          content,
          attachment, // this is the S3 public URL
          author,
        });
        setIsLoading(false);
        nav("/");
      } catch (e) {
        onError(e);
        setIsLoading(false);
      }
    }
  return (
    <div>
      {/* <div className="bg-white rounded-xl shadow p-4 space-y-4 mx-auto">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/avatar.jpg" alt="User avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Input
            placeholder="What's on your mind?"
            className="flex-1 bg-gray-100 rounded-full py-2 px-4"
          />
          <Button className="whitespace-nowrap">Share Post</Button>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <div className="flex space-x-6">
            <button className="flex items-center space-x-1 hover:text-blue-500">
              <ImageIcon className="h-5 w-5" />
              <span>Image/Video</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-blue-500">
              <LinkIcon className="h-5 w-5" />
              <span>Attachment</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-blue-500">
              <Video className="h-5 w-5" />
              <span>Live</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-blue-500">
              <Hash className="h-5 w-5" />
              <span>Hashtag</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-blue-500">
              <AtSign className="h-5 w-5" />
              <span>Mention</span>
            </button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-1 hover:text-gray-800">
                <span>Public</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Public</DropdownMenuItem>
              <DropdownMenuItem>Friends</DropdownMenuItem>
              <DropdownMenuItem>Only Me</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div> */}


      <div className="bg-white rounded-xl shadow p-4 mb-5 space-y-4 mx-auto">
        {/* Top Input Row */}
        <div className="flex items-center space-x-3">
          <a href="/settings/profile">
          <img
            src="https://github.com/shadcn.png" // replace with user avatar if available
            alt={author}
            className="w-10 h-10 rounded-full"
          />
          </a>
          <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none">
            <span>{`What's on your mind, ${author}`}</span>
          </div>
        </div>
  
        {/* Action Buttons */}
        <div className="flex justify-between border-t pt-2">
          {/* Art post */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost"><Palette className="text-red-500 w-5 h-5" />Art</Button>
            </DialogTrigger>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <div>
                  <p className='text-xl font-bold text-center'>Create art post</p>
                </div>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Input
                      type="text"
                      placeholder="Artwork Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                    <Textarea
                      placeholder="Describe Artwork"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required
                    />
                  </div>
                </div>
                  {file.current && (
                    <img
                      src={URL.createObjectURL(file.current)}
                      alt="Preview"
                      className="mt-2 rounded shadow-md w-full max-w-sm"
                    />
                  )}
                
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                
                <DialogFooter>
                  <Button type="submit" disabled={isLoading} className="mt-3 w-full">
                    {isLoading ? "Posting..." : "Create Post"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
  
          {/* Post */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost"><ImageIcon className="text-green-500 w-5 h-5" />Post</Button>
            </DialogTrigger>
              <DialogTitle></DialogTitle>
              <DialogDescription></DialogDescription>
              <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <div>
                  <p className='text-xl font-bold text-center'>Create art post</p>
                </div>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Input
                      type="text"
                      placeholder="Artwork Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                    <Textarea
                      placeholder="Describe Artwork"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required
                    />
                  </div>
                </div>
                  {file.current && (
                    <img
                      src={URL.createObjectURL(file.current)}
                      alt="Preview"
                      className="mt-2 rounded shadow-md w-full max-w-sm"
                    />
                  )}
                
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                
                <DialogFooter>
                  <Button type="submit" disabled={isLoading} className="mt-3 w-full">
                    {isLoading ? "Posting..." : "Create Post"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
  
          {/* Article */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost"><Film className="text-pink-500 w-5 h-5" /><span>Write article</span></Button>
            </DialogTrigger>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
            <DialogContent className="sm:max-w-5xl">
              <form onSubmit={handleSubmit}>
                <div>
                  <p className='text-xl font-bold text-center py-5'>Create Blog post</p>
                </div>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Textarea
                      placeholder="Start writing something about art"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isLoading} className="mt-3 w-full">
                    {isLoading ? "Posting..." : "Create Post"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default NewPost;