import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { CommentType, CommentNode } from "@/types/comment";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildCommentTree(comments: CommentType[]): CommentNode[] {
  const map = new Map<string, CommentNode>();
  comments.forEach(c => {
    map.set(c.commentId, { ...c, replies: [] });
  });

  const roots: CommentNode[] = [];
  comments.forEach(c => {
    if (c.parentCommentId) {
      const parent = map.get(c.parentCommentId);
      if (parent) parent.replies.push(map.get(c.commentId)!);
    } else {
      roots.push(map.get(c.commentId)!);
    }
  });

  // newest first
  roots.sort((a, b) => b.createdAt - a.createdAt);
  return roots;
}
