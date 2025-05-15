import { createContext, useContext, useEffect, useState } from "react";
import { UserInformation } from "../types/loginCreds";
import { userApi } from "@/services/api";
import { compareSync } from "bcrypt-ts";

interface AuthContextType {
  user: { name: string; role: string } | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const existing = localStorage.getItem("loggedIn");
    if (existing) {
      setUser(JSON.parse(existing));
    }
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    const allUsers = (await userApi.getAllUsers()) as UserInformation[];
    const loginUser = allUsers.find(
      (u: UserInformation) =>
        u.email === email && compareSync(password, u.password)
    );

    if (loginUser) {
      const loggedInUser = { name: loginUser.firstName, role: loginUser.role };
      setUser(loggedInUser);
      localStorage.setItem("loggedIn", JSON.stringify(loggedInUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("loggedIn");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
