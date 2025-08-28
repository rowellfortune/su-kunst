import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Heart, MessageCircle } from "lucide-react";


// ---------- Modal that opens from URL (?post=ID) ----------
function PostDialog() {
  const navigate = useNavigate();
  const location = useLocation();
  const [postId, setPostId] = useQueryParam("post");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState<Post | null>(null);

  // Open/close when URL changes
  useEffect(() => {
    const hasId = !!postId;
    setOpen(Boolean(hasId));
  }, [postId]);

  // Lazy-load the post when opening
  useEffect(() => {
    let alive = true;
    if (open && postId) {
      setLoading(true);
      fetchPostById(postId).then((data) => {
        if (!alive) return;
        setPost(data);
        setLoading(false);
      });
    } else {
      setPost(null);
    }
    return () => {
      alive = false;
    };
  }, [open, postId]);

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      // Remove the query param while preserving any others
      setPostId(null);
    }
  };

  // Close via explicit button
  const close = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 sm:max-w-xl max-h-[85vh] overflow-hidden">
        <DialogHeader className="px-4 pt-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-semibold">
              {post ? `${post.author}'s post` : "Post"}
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={close} aria-label="Close post">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="grid gap-3 px-4 pb-4 overflow-y-auto">
          {loading && (
            <div className="animate-pulse space-y-3">
              <div className="h-6 w-1/3 rounded bg-muted" />
              <div className="h-4 w-2/3 rounded bg-muted" />
              <div className="h-48 rounded-xl bg-muted" />
            </div>
          )}

          {!loading && post && (
            <article>
              <header className="mb-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200" />
                <div>
                  <div className="font-semibold">{post.author}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(post.createdAt).toLocaleString()}
                  </div>
                </div>
              </header>
              <p className="mb-3 text-sm leading-relaxed">{post.content}</p>
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="Post media"
                  className="mb-4 w-full rounded-xl object-cover"
                />
              )}
              <footer className="flex items-center gap-4 text-sm">
                <Button variant="ghost" size="sm" className="gap-1">
                  <Heart className="h-4 w-4" /> {post.likes}
                </Button>
                <Button variant="ghost" size="sm" className="gap-1">
                  <MessageCircle className="h-4 w-4" /> {post.comments}
                </Button>
              </footer>
            </article>
          )}

          {!loading && !post && (
            <p className="text-sm text-muted-foreground">Post niet gevonden.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PostDialog;