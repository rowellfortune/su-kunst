// components/CommentThread.tsx
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronDown, ThumbsUp, ThumbsDown } from "lucide-react";

export interface Comment {
  id: string;
  author: {
    name: string;
    avatarUrl?: string;
  };
  content: string;
  createdAt: Date;
  likes: number;
  dislikes: number;
  replies?: Comment[];
}

interface CommentItemProps {
  comment: Comment;
  depth?: number;
}

function CommentItem({ comment, depth = 0 }: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(false);
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className={`flex space-x-3 ${depth > 0 ? "pl-12" : ""} py-4`}>
      <Avatar className="h-10 w-10">
        {comment.author.avatarUrl
          ? <AvatarImage src={comment.author.avatarUrl} alt={comment.author.name} />
          : <AvatarFallback>{comment.author.name[0]}</AvatarFallback>}
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="font-medium">{comment.author.name}</span>
          <span className="text-xs text-muted-foreground">{comment.createdAt.toLocaleDateString()}</span>
        </div>
        <p className="mt-1 text-sm text-gray-100">{comment.content}</p>
        <div className="mt-2 flex items-center space-x-4 text-xs text-muted-foreground">
          <button className="flex items-center space-x-1 hover:text-white">
            <ThumbsUp className="h-4 w-4" /> <span>{comment.likes}</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-white">
            <ThumbsDown className="h-4 w-4" /> <span>{comment.dislikes}</span>
          </button>
          <button className="hover:underline">Reply</button>
          <button className="hover:underline">Translate</button>
        </div>

        {hasReplies && (
          <Button
            variant="link"
            size="sm"
            className="mt-2 flex items-center space-x-1 px-0 text-xs text-muted-foreground hover:text-white"
            onClick={() => setShowReplies(!showReplies)}
          >
            <span>{showReplies ? "Hide" : `See ${comment.replies!.length} Replies`}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showReplies ? "rotate-180" : ""}`} />
          </Button>
        )}

        {showReplies && comment.replies!.map((r) => (
          <CommentItem key={r.id} comment={r} depth={depth + 1} />
        ))}
      </div>
    </div>
  );
}

export interface CommentThreadProps {
  comments: Comment[];
}

export function CommentThread({ comments }: CommentThreadProps) {
  return (
    <Card className="bg-slate-800 text-white">
      <CardContent>
        {comments.map((c) => (
          <CommentItem key={c.id} comment={c} />
        ))}
      </CardContent>
    </Card>
  );
}
