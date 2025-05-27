import axios from "axios";
import { UserInformation } from "../types/loginCreds";
import { ApplicationInfo } from "@/types/application";


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
  
  getAllCourses: async () => {
    const response = await api.get("/courses");
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
  getLecturerCoursesById: async (lecturerId: number) => {
    const response = await api.get(`/lecturers/${lecturerId}`);
    return response.data;
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
      ...( {
        data: { lecturerId, applicantId },
      } as any )
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
};
