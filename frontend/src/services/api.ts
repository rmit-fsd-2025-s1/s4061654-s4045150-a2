import axios from "axios";
import { UserInformation } from "../types/loginCreds";
import { ApplicationInfo } from "@/types/application";
import { Comment } from "@/types/comment";


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

  getAllCourses: async (): Promise<{ id: number; courseName: string }[]> => {
    const response = await api.get<{ id: number; courseName: string }[]>("/courses");
    return response.data;
  },

  saveApplication: async (application: ApplicationInfo) => {
    const response = await api.post("/applications", application);
    return response.data;
  },

  getAllApplications: async (): Promise<ApplicationInfo[]> => {
    const response = await api.get<ApplicationInfo[]>("/applications");
    return response.data;
  },

  // Lecturer methods
  getCoursesByLecturer: async (lecturerId: number): Promise<{ courseID: number; courseName: string }[]> => {
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

  // Selected course methods
  getSelectionsByLecturer: async (lecturerId: number): Promise<number[]> => {
    const res = await api.get<number[]>(`/selections/${lecturerId}`);
    return res.data;
  },

  selectApplicant: async (lecturerId: number, applicantId: number) => {
    await api.post("/selections", { lecturerId, applicantId });
  },

  deselectApplicant: async (lecturerId: number, applicantId: number) => {
    await api.delete("/selections", {
      ...({
        data: { lecturerId, applicantId },
      } as any),
    });
  },

  // Ranking methods
  getRankingsByLecturer: async (lecturerId: number): Promise<number[]> => {
    const res = await api.get<number[]>(`/rankings/${lecturerId}`);
    return res.data;
  },

  saveRankings: async (lecturerId: number, ranked: number[]) => {
    await api.post("/rankings", { lecturerId, ranked });
  },

  getApplicantCourses: async (userId: number) => {
    const response = await api.get(`/applicant-courses?applicantId=${userId}`);
    return response.data;
  },

  // Add a comment to an application
  addComment: async (applicationId: number, lecturerId: number, content: string): Promise<Comment> => {
    const res = await api.post<Comment>("/comments", {
      content,
      applicationId,
      lecturerId,
    });
    return res.data;
  },

  // Get all comments for a specific application
  getCommentsByApplication: async (applicationId: number): Promise<Comment[]> => {
    const res = await api.get<Comment[]>(`/comments/application/${applicationId}`);
    return res.data;
  },

};
