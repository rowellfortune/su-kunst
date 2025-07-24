// src/components/Comments.tsx
import React, { useContext, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "@/lib/contextLib";
import { onError } from "@/lib/errorLib";
import {
  useGetPostsQuery,
  useAddPostMutation,
} from "@/store/apis/commentsApi";
import { buildCommentTree } from "@/lib/utils";
import { CommentItem } from "./CommentItem";
import type { CommentType, CommentNode } from "@/types/comment";

interface CommentsProps {
  author?: string;
  pk?: string;
  userId?: string;
  postId?: string;
}

export default function Comments({
  author,
  pk,
  userId,
}: CommentsProps) {
  const { user } = useContext(AppContext);
  const nav = useNavigate();

  // single formData object
  const [formData, setFormData] = useState<{
    content?: string;
    postId?: string;
    userId?: string;
    user?: string;
    parentCommentId?: string | null;
  }>({
    content: "",
    postId: pk,
    userId,
    user: user?.username,
    parentCommentId: null,
  });

  // track the author name of the comment being replied to
  const [parentAuthor, setParentAuthor] = useState<string | null>(null);

  // reset username if it changes (e.g. on login)
  useEffect(() => {
    setFormData((f) => ({ ...f, user: user?.username }));
  }, [user?.username]);

  const { data = [], isLoading } = useGetPostsQuery();
  const [addPost] = useAddPostMutation();
  const [loading, setLoading] = useState(false);

  // only comments for this post
  // build and filter
  const flat = (data as CommentType[]).filter(
    (c) => c.entityType === "COMMENT" && c.pk === pk
  );

  // build nested tree
  const tree: CommentNode[] = buildCommentTree(flat);

  // when clicking “Reply”
  const handleReply = (parentId: string, parentUser: string) => {
    setFormData((f) => ({ ...f, parentCommentId: parentId }));
    setParentAuthor(parentUser);
  };

// cancel reply mode
  const handleCancelReply = () => {
    setFormData((f) => ({ ...f, parentCommentId: null }));
    setParentAuthor(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((f) => ({ ...f, content: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addPost(formData).unwrap();
      // reset
      setFormData({
        content: "",
        postId: pk,
        userId,
        user: user?.username,
        parentCommentId: null,
      });
      setParentAuthor(null);
      nav(0); // refresh
    } catch (err) {
      onError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-1">
          <MessageSquare className="w-5 h-5 text-pink-500" />
          <span>{isLoading ? "…" : flat.length} Comments</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogTitle className="text-xl font-bold text-center">
          Comments on {author}’s post
        </DialogTitle>

        <div className="mt-4 space-y-2 max-h-80 overflow-y-auto">
          {tree.map((c) => (
            <CommentItem
              key={c.commentId}
              comment={c}
              onReply={handleReply}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          {formData.parentCommentId && parentAuthor && (
            <p className="mb-2 text-sm text-muted-foreground">
              Replying to{" "}
              <strong>
                {parentAuthor}
                {"’s"} comment
              </strong>
              {"  "}
              <button
                type="button"
                onClick={handleCancelReply}
                className="underline"
              >
                Cancel
              </button>
            </p>
          )}
          
          <Textarea
            placeholder="Write your comment…"
            value={formData.content}
            onChange={handleChange}
            required
          />

          <DialogFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Posting…" : "Post Comment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
