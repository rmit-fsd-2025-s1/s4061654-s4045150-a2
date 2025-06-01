import { Comment } from "./comment";
import { experience } from "./experience";
import { qualification } from "./qualification";
export type ApplicationInfo = {
  applicationID: number;
  position: string;
  applicant: number;
  coursesApplied: number[];
  availability: string | null;
  experience?: experience[];
  skills: string[];
  academics: qualification[];
};
