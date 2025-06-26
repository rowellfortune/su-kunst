export interface OpportunityType {
  id?: string;
  title?: string;
  description?: string;
  deadline?: string;
  location?: string;
  category?: string;
  status?: "public" | "draft";
  createdAt?: string;
}
