import { Comment } from "./comment";
import { experience } from "./experience";
import { academics } from "./academics";
import { course } from "./course";

export type ApplicationInfo = {
  applicationID: number;
  position: string;
  name: string;
  coursesApplied: course[];
  availability: string | null;
  prevExp?: experience[];
  skills: string[];
  academics: academics[];
  comment?: Comment[];
  selectedCount?: number;
};
