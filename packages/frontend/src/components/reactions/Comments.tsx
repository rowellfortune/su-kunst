import React, { useEffect, useState } from 'react'
import { FaComment } from 'react-icons/fa';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { API, Auth } from 'aws-amplify';
import type { CommentType } from '@/types/comment';
import { useAppContext } from '@/lib/contextLib';
import { onError } from '@/lib/errorLib';
import { useNavigate } from 'react-router-dom';

function Comments({ author, pk, userId, postId}: CommentType) {
  console.log(author)
    const { isAuthenticated } = useAppContext();
  const [user, setUser] = useState("")
  console.log(user);
  const [comments, setComments] = useState<Array<CommentType>>([]);
  const nav = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    content: "",
    postId: pk,
    userId: userId,
    user: user
  });

  console.log(formData);

  function getCommentsForPost(data: CommentType[], postId: string) {
    return data.filter((item) => {
      return (
        item.entityType === "COMMENT" &&
        item.sk?.includes(postId)
      );
    });
  }

  const comment = getCommentsForPost(comments, postId!);

  const handleChange = (field: keyof CommentType, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  function createComment(comment: CommentType) {
    return API.post("comments", "/comments", {
      body: comment,
    });
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      await createComment(formData);
      nav('/');
    } catch (e) {
      onError(e);
    } finally {
      setLoading(false);
    }
  };
  
  function loadCmments() {
    return API.get("comments", "/comments", {});
  }

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      const user = await Auth.currentAuthenticatedUser();
      setFormData((prev) => ({ ...prev, user: user?.username }));
      setUser(user?.username);

      try {
        const comments = await loadCmments();
        setComments(comments);
      } catch (e) {
        onError(e);
      }
      
      setLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);
  

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" className='flex justify-between'>
            <FaComment className="text-pink-500 w-5 h-5" />
            
            <span>{comment.length} Comments</span>
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          {comment.length > 0 && (
            <div className="mt-4 space-y-2">
              {comment.map((c, index) => (
                <div key={index} className="border p-2 rounded text-sm">
                  <p className="text-gray-700">{c.content}</p>
                  <p className="text-xs text-gray-500">— {c.user}</p>
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
     
    </div>
  )
}

export default Comments;