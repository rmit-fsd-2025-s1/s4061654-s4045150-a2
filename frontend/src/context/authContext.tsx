import { createContext, useContext, useEffect, useState } from "react";
import { UserInformation } from "../types/loginCreds";
import { userApi } from "@/services/api";

interface AuthContextType {
  user: { id: number; name: string; role: string } | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{
    id: number;
    name: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    const existing = localStorage.getItem("loggedIn");
    if (existing) {
      setUser(JSON.parse(existing));
    }
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const loginUser = (await userApi.login(
        email,
        password
      )) as UserInformation;
      if (loginUser && loginUser.firstName && loginUser.role) {
        const loggedInUser = {
          id: loginUser.userid,
          name: loginUser.firstName,
          role: loginUser.role,
        };
        setUser(loggedInUser);
        localStorage.setItem("loggedIn", JSON.stringify(loggedInUser));
        return true;
      }
      return false;
    } catch {
      return false;
    }
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
