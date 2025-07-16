import React, {useContext, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { CommentType } from '@/types/comment';
import { AppContext } from '@/lib/contextLib';
import { onError } from '@/lib/errorLib';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { useGetPostsQuery, useAddPostMutation } from '@/store/apis/commentsApi';

function Comments({ author, pk, userId, postId}: CommentType) {
  const {user} = useContext(AppContext)
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    content: "",
    postId: pk,
    userId: userId,
    user: user?.username
  });
  const { data: comments, isLoading} = useGetPostsQuery();
  const [addPost] = useAddPostMutation();

  function getCommentsForPost(data: CommentType[], postId: string) {
    return data?.filter((item) => {
      return (
        item?.entityType === "COMMENT" &&
        item?.sk?.includes(postId)
      );
    });
  }

  const comment = getCommentsForPost(comments!, postId!);
  
  const handleChange = (field: keyof CommentType, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      await addPost(formData).unwrap();
      nav('/');
      setLoading(false)
    } catch (e) {
      onError(e);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" className='flex justify-between rounded'>
            <MessageSquare className="text-pink-500 w-5 h-5" />
            {!isLoading ? <span>{comment?.length}</span> : <>0</>} Comment{comment?.length === 1 ? "" : "s"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          {comment?.length > 0 && (
            <div className="mt-4 space-y-2">
              {comment?.map((c, index) => (
                <div key={index} className="border p-2 rounded text-sm">
                  <p className="text-gray-700">{c.content}</p>
                  <p className="text-xs text-gray-500">— {c?.user}</p>
                </div>
              ))}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <DialogTitle className='text-xl font-bold text-center'>
              Comment on {author} post
            </DialogTitle>

            <div className="grid gap-4">
              <div className="grid gap-3">
                <Textarea
                  placeholder="Type a comment"
                  value={formData.content}
                  onChange={(e) => handleChange("content", e.target.value)}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" className='text-center w-full rounded font-bold'>
                {loading ? "Commenting..." : "Post a comment"}
              </Button>
            </DialogFooter>
          </form>
          
        </DialogContent>       
      </Dialog> 
    </>
  )
}

export default Comments;