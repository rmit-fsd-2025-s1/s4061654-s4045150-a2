import axios from "axios";
import { UserInformation } from "../types/loginCreds";
import { ApplicationInfo } from "@/types/application";
import { Comment } from "@/types/comment";
import { User } from "@/types/user";

export const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

export const userApi = {
  getAllUsers: async () => {
    const response = await api.get("/users");
    return response.data;
  },

  getUserById: async (id: number) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (user: Partial<UserInformation>) => {
    const response = await api.post("/users", user);
    return response.data;
  },

  updateUser: async (id: number, user: Partial<UserInformation>) => {
    const response = await api.put(`/users/${id}`, user);
    return response.data;
  },

  deleteUser: async (id: number) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post("/login", { email, password });
    return response.data;
  },

  getAllCourses: async (): Promise<
    { courseID: number; courseName: string }[]
  > => {
    const response =
      await api.get<{ courseID: number; courseName: string }[]>("/courses");
    return response.data;
  },
  // ─────────────────────────────────────────────────────────────────────────────
  // APPLICATION‐related endpoints

  /**
   * Fetch every row from the `applications` table, with optional filters/sorting.
   * Accepts an optional filters object with keys: name, skills, course, availability, position, sortBy, sortOrder
   */
  getAllApplications: async (filters: Record<string, any> = {}): Promise<
    Array<{
      applicationID: number;
      applicant: UserInformation;
      position: string;
      availability: string;
      skills: string[];
    }>
  > => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) params.set(key, value.join(","));
      } else if (value !== undefined && value !== null && value !== "") {
        params.set(key, value);
      }
    });
    const response = await api.get<
      Array<{
        applicationID: number;
        applicant: UserInformation;
        position: string;
        availability: string;
        skills: string[];
      }>
    >(`/applications${params.toString() ? `?${params.toString()}` : ""}`);
    return response.data;
  },

  /**
   * Save a new application. We assume the payload is full ApplicationInfo—
   * but on the front end you will only call this when submitting. We leave it
   * here in case you need it for “Apply To Become A Tutor.”
   */
  saveApplication: async (application: ApplicationInfo) => {
    const response = await api.post("/applications", application);
    return response.data;
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // APPLICATION‐COURSE JOIN TABLE (`applicationcourses`) ENDPOINT
  //
  // This fetches every row from applicationcourses, each shaped like:
  //   {
  //     id: number;
  //     application: number | { applicationID: number };
  //     course: { courseID: number; courseName: string };
  //   }
  // You can use this to look up which courseIDs a given applicationID has.
  getAllApplicationCourses: async (): Promise<
    Array<{
      id: number;
      application: number | { applicationID: number };
      course: { courseID: number; courseName: string };
    }>
  > => {
    const response = await api.get<
      Array<{
        id: number;
        application: number | { applicationID: number };
        course: { courseID: number; courseName: string };
      }>
    >("/applicationcourses");
    return response.data;
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // LECTURER‐related endpoints

  // Fetch all courses (courseID + courseName) that a given lecturer is assigned to
  getCoursesByLecturer: async (
    lecturerId: number
  ): Promise<{ courseID: number; courseName: string }[]> => {
    const res = await api.get(`/lecturers/${lecturerId}/courses`);
    return res.data as { courseID: number; courseName: string }[];
  },

  assignLecturerCourse: async (lecturerId: number, courseId: number) => {
    const response = await api.post("/lecturers", { lecturerId, courseId });
    return response.data;
  },

  deleteLecturerCourse: async (rowId: number) => {
    const response = await api.delete(`/lecturers/${rowId}`);
    return response.data;
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // SELECTION‐related endpoints (select/deselect an applicant)

  getSelectionsByLecturer: async (lecturerId: number): Promise<number[]> => {
    const res = await api.get<number[]>(`/selections/${lecturerId}`);
    return res.data;
  },

  selectApplicant: async (
    lecturerId: number,
    applicationId: number,
    courseId: number
  ) => {
    await api.post("/selections", { lecturerId, applicationId, courseId });
  },

  deselectApplicant: async (
    lecturerId: number,
    applicationId: number,
    courseId: number
  ) => {
    await api.delete("/selections", {
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        lecturerId,
        applicationId,
        courseId,
      },
    } as any);
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // RANKING‐related endpoints

  getRankingsByLecturer: async (
    lecturerId: number,
    courseId: number
  ): Promise<{ applicationId: number; rank: number }[]> => {
    const res = await api.get<{ applicationId: number; rank: number }[]>(
      `/rankings/${lecturerId}/${courseId}`
    );
    return res.data;
  },

  saveRankings: async (
    lecturerId: number,
    courseId: number,
    ranked: { applicationId: number; rank: number }[]
  ) => {
    await api.post("/rankings", { lecturerId, courseId, ranked });
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // APPLICANT‐COURSES endpoint (for applicant profile page)

  getApplicantCourses: async (userId: number) => {
    const response = await api.get(`/applicant-courses?applicantId=${userId}`);
    return response.data;
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // COMMENT‐related endpoints

  getCommentsByApplication: async (
    applicationId: number
  ): Promise<Comment[]> => {
    const res = await api.get<Comment[]>(
      `/comments/application/${applicationId}`
    );
    return res.data;
  },

  addComment: async (
    applicationId: number,
    lecturerId: number,
    content: string
  ): Promise<Comment> => {
    const res = await api.post<Comment>("/comments", {
      content,
      applicationId,
      lecturerId,
    });
    return res.data;
  },

  // Fetch all ApplicationCourses rows for a given applicationID:
  getApplicationCoursesByAppID: async (
    applicationId: number
  ): Promise<{ course: { courseID: number; courseName: string } }[]> => {
    const res = await api.get<
      { course: { courseID: number; courseName: string } }[]
    >(`/applicationcourses?applicationId=${applicationId}`);
    return res.data;
  },

  getCourseById: async (
    id: number
  ): Promise<{ courseID: number; courseName: string }> => {
    const res = await api.get<{ courseID: number; courseName: string }>(
      `/courses/${id}`
    );
    return res.data;
  },

  getExperienceByApplicationId: async (applicationId: number) => {
    const response = await api.get(
      `/experience?applicationId=${applicationId}`
    );
    return response.data as Array<{
      position: string;
      company: string;
      description: string;
      // plus whatever other fields your Experience entity has
    }>;
  },

  getAcademicsByApplicationId: async (applicationId: number) => {
    const response = await api.get(`/academics?applicationId=${applicationId}`);
    return response.data as Array<{
      degree: string;
      university: string;
      year: number;
      // plus any other fields from your Academics entity
    }>;
  },
};
