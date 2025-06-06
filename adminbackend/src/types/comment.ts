export type Comment = {
  id: number;
  content: string;
  createdAt: string;
  lecturer: {
    firstName: string;
    lastName: string;
    id: number;
  };
};
