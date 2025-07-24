// src/types/comment.ts
export interface CommentType {
  pk: string;                 // postId
  sk: string;                 // e.g. "COMMENT#<parentId>#<commentId>" or "COMMENT#<commentId>"
  commentId: string;          // unique ID
  parentCommentId?: string | null;
  content: string;
  user: string;
  createdAt: number;
  entityType: "COMMENT";
}

export interface CommentNode extends CommentType {
  replies: CommentNode[];
}
