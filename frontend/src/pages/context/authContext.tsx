import { createContext, useContext, useEffect, useState } from "react";
import { loginCreds } from "../types/loginCreds";
// Interface for context
interface AuthContextType {
  user: { name: string; tutor: boolean } | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{ name: string; tutor: boolean } | null>(
    null
  );
  const [users, setUsers] = useState<loginCreds[]>([]);

  // Initial useEffect to retrieve all users and to check for existing logins
  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    setUsers(allUsers);

    const existing = localStorage.getItem("loggedIn");
    if (existing) {
      setUser(JSON.parse(existing));
    }
  }, []);

  // Login function
  const login = (email: string, password: string) => {
    const loginUser = users.find(
      (u: loginCreds) => u.email === email && u.password === password
    );

    if (loginUser) {
      // Store the full user object including the tutor flag
      setUser({ name: loginUser.name, tutor: loginUser.tutor });
      localStorage.setItem("loggedIn", JSON.stringify(loginUser));
      return true;
    }
    return false;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("loggedIn");
  };

  // Return context
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
