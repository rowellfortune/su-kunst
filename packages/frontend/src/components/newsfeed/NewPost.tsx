import {
  // Image as ImageIcon,
  Palette,
  // Film,
} from "lucide-react";
// import { ImageIcon, Film, Palette } from 'lucide-react'; // Using lucide icons
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { API} from 'aws-amplify';
import { s3Upload } from '@/lib/awsLib';
import { onError } from '@/lib/errorLib';
import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext, useAppContext} from '@/lib/contextLib';
import type { PostType } from '@/types/post';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DialogTitle } from '@radix-ui/react-dialog';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetUserQuery } from "@/store";

const NewPost = () => {
  const file = useRef<null | File>(null);
  // console.log(file)
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const {isAuthenticated } = useAppContext();
  const {user} = useContext(AppContext)
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true);
  const effectiveId = user.attributes.sub ?? "";
  const {
    data: userInfo,
    error: userInfoError,
    isLoading: userInfoLoading,
  } = useGetUserQuery(effectiveId, { skip: !isAuthenticated || !effectiveId });

  // fallback to the passed‑in `author` if we don’t have the full profile yet
  const avatarUrl   = userInfo?.profile.avatarFileattachment;
  
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
      setIsLoading(false);
    }

    onLoad();
    nav('/');
  }, [isAuthenticated, user, open]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if ( event.currentTarget.files === null ) return
    file.current = event.currentTarget.files[0];
  }
  
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

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
        userId: user.attributes.sub
      });
      setIsLoading(false);
      setOpen(false)
      location.reload();
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div className="bg-white rounded-xl shadow p-4 mb-5 space-y-4 mx-auto">
        {/* Top Input Row */}
        <div className="flex items-center space-x-3">
          <Link to={`/profile/${user.attributes.sub}`}>
            <Avatar className="h-10 w-10">
              {!userInfoError &&  !userInfoLoading ? (
              <AvatarImage src={avatarUrl} alt="Jakob Botosh" />
              ):(
              <AvatarFallback>{author[0]}</AvatarFallback>
              )}
            </Avatar>
          </Link>
          <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none">
            <span>{`What's on your mind, ${author}`}</span>
          </div>
        </div>
  
        {/* Action Buttons */}
        <div className="flex justify-between border-t pt-2">
          {/* Art post */}
          <Dialog open={open} onOpenChange={setOpen}>
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
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleFileChange}
                  />
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
                    <>
                      <img
                        src={URL.createObjectURL(file.current)}
                        srcSet={URL.createObjectURL(file.current)}
                        alt="Preview"
                       
                        className="mt-2 rounded shadow-md w-full max-w-sm"
                      />
                      <source src={URL.createObjectURL(file.current)} type={file?.current?.type}  srcSet={URL.createObjectURL(file.current)}/>
                    </>
                  )}
                
                 
                
                <DialogFooter>
                  <Button type="submit" disabled={isLoading} className="mt-3 w-full">
                    {isLoading ? "Posting..." : "Create Post"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
  
          {/* Post */}
          {/* <Dialog>
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
   */}
          {/* Article */}
          {/* <Dialog>
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
          </Dialog> */}
        </div>
      </div>
    </div>
  );
};

export default NewPost;