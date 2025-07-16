export interface PostType {
  sk?: string;
  pk?: string;
  title?: string;
  author: string;
  userId?: string;
  content?: string;
  postedBy?: string;
  createdAt?: number;
  entityType?: string;
  attachment?: string;
  attachmentURL?: string;
}