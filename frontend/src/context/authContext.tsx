import { createContext, useContext, useEffect, useState } from "react";
import { UserInformation } from "../types/loginCreds";
import { userApi } from "@/services/api";

//Interface that defines the structure of the AuthContext
interface AuthContextType {
  user: { id: number; name: string; role: string } | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}
// Creating the AuthContext with a default value of undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  //A state declared to hold the user information
  const [user, setUser] = useState<{
    id: number;
    name: string;
    role: string;
  } | null>(null);

  //On mount, check if user is already logged in by checking localStorage
  useEffect(() => {
    const existing = localStorage.getItem("loggedIn");
    if (existing) {
      setUser(JSON.parse(existing));
    }
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      //Try to login using the login function from userApi
      const loginUser = (await userApi.login(
        email,
        password
      )) as UserInformation;
      // If loginUser is not null and contains the necessary fields, set the user state to the logged-in user
      if (loginUser && loginUser.firstName && loginUser.role) {
        const loggedInUser = {
          id: loginUser.userid,
          name: loginUser.firstName,
          role: loginUser.role,
        };
        setUser(loggedInUser);
        // Store the logged-in user in localStorage
        // This allows the user to stay logged in even after a page refresh
        localStorage.setItem("loggedIn", JSON.stringify(loggedInUser));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };
  //If the logout button is pressed, the user state is set to null and loggedIn in localStorage is removed
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
