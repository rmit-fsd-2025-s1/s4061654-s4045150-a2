import { Comment } from "./comment";
import { experience } from "./experience";
import { qualification } from "./academics";
import { course } from "./course";

export type ApplicationInfo = {
  applicantionID: number;
  position: string;
  name: string;
  coursesApplied: course[];
  availability: string | null;
  prevExp?: experience[];
  skills: string[];
  academics: qualification[];
  comment?: Comment[];
  selectedCount?: number;
};
