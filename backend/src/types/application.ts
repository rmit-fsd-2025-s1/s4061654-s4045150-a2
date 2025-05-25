import { Comment } from "./comment";
import { experience } from "./experience";
import { qualification } from "./qualification";

export type ApplicationInfo = {
  applicantionID: number;
  name: string;
  coursesApplied: string[];
  availability: string | null;
  prevExp?: experience[];
  skills: string[];
  academics: qualification[];
  comment?: Comment[];
  selectedCount?: number;
};
