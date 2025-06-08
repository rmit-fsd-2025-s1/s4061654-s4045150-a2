import { UserInfo } from "os";
import { Comment } from "./comment";
import { experience } from "./experience";
import { qualification } from "./qualification";
import { UserInformation } from "./loginCreds";
import { course } from "./course";

export type ApplicationInfo = {
  applicationID: number;
  position: string;
  applicant: UserInformation;
  coursesApplied: number[];
  coursesAppliedObj?: course[];
  availability: string | null;
  experience?: experience[];
  skills: string[];
  academics: qualification[];
};
