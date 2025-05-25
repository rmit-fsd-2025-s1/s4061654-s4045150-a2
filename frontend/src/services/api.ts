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
};
