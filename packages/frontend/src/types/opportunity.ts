export interface OpportunityType {
  pk?: string;
  title?: string;
  description?: string;
  deadline?: string;
  location?: string;
  type?: string;
  company: string;
  category?: string;
  attachment?: string;
  status?: "public" | "draft";
  createdAt: string;
}
