// src/components/CommentItem.tsx
import { useState } from "react";
import { Avatar, AvatarFallback,
  //  AvatarImage 
  } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronDown,  } from "lucide-react";
import type { CommentNode } from "@/types/comment";

interface CommentItemProps {
  comment: CommentNode;
  depth?: number;
  onReply: (parentId: string, parentUser: string) => void;
}

export function CommentItem({
  comment,
  depth = 0,
  onReply,
}: CommentItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`flex space-x-3 ${depth ? "pl-8" : ""} py-3`}>

      <Avatar className="h-8 w-8">
        <AvatarFallback>{comment.user[0]}</AvatarFallback>
      </Avatar>

      <div className="flex-1">

        {/* author & date */}
        <div className="flex items-center space-x-2 text-sm">
          <span className="font-medium">{comment.user}</span>
          <span className="text-xs text-muted-foreground">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* content */}
        <p className="mt-1 text-sm text-gray-900">{comment.content}</p>

        {/* actions */}
        <div className="mt-2 flex items-center space-x-4 text-xs text-muted-foreground">
          <button className="flex items-center space-x-1 hover:text-white">
            {/* <ThumbsUp className="h-4 w-4" /> {comment.likes ?? 0} */}
          </button>
          <button className="flex items-center space-x-1 hover:text-white">
            {/* <ThumbsDown className="h-4 w-4" /> {comment.dislikes ?? 0} */}
          </button>
          <button
            onClick={() => onReply(comment.commentId, comment.user)}
            className="hover:underline"
          >
            Reply
          </button>
        </div>

        {/* toggle replies */}
        {comment.replies.length > 0 && (
          <Button
            variant="link"
            size="sm"
            className="mt-2 px-0 text-xs text-muted-foreground hover:text-white"
            onClick={() => setOpen(!open)}
          >
            {open ? "Hide" : `See ${comment.replies.length} Replies`}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </Button>
        )}

        {/* nested */}
        {open &&
          comment.replies.map((r) => (
            <CommentItem
              key={r.commentId}
              comment={r}
              depth={depth + 1}
              onReply={onReply}
            />
        ))}

      </div>
      
    </div>
  );
}
