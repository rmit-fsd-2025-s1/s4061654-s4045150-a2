import { userApi } from "../services/api";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/adminAuth";

export default function AdminLogin() {
  // Using a custom auth context for admin login
  const { login } = useAuth();

  // State to store credentials for admin login
  const [creds, setCreds] = useState({
    username: "",
    password: "",
  });
  // States to manage login errors and success messages
  const [loginError, setLoginError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const router = useRouter();
  // Function to handle admin login (passing it into authContext)
  const handleLogin = async (username: string, password: string) => {
    //Attempt to login using the login function from userApi
    const log = await login(username, password);
    if (!log) {
      // If login fails, set the error message
      setLoginError("Invalid username or password.");
      return;
    } else {
      // If login is successful, set the success message and redirect
      setSuccessMessage("Login successful!");
      setTimeout(() => {
        router.push("/course");
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md flex flex-col items-center">
        {/* Logo or Icon */}

        <h2 className="text-2xl font-bold mb-2 text-blue-700">Admin Login</h2>
        <p className="text-gray-500 mb-6 text-center">
          Please log in to access admin features.
        </p>
        <form className="w-full" autoComplete="off">
          <input
            type="text"
            placeholder="Username"
            className="border border-gray-300 rounded-md p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            onChange={(e) => {
              setLoginError("");
              setCreds({ ...creds, username: e.target.value });
            }}
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 rounded-md p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            onChange={(e) => setCreds({ ...creds, password: e.target.value })}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 w-full rounded-md hover:bg-blue-700 transition duration-200 font-semibold"
            onClick={async (e) => {
              e.preventDefault();
              await handleLogin(creds.username, creds.password);
            }}
          >
            Login
          </button>
          {loginError && (
            <p className="text-red-500 mt-3 text-center">{loginError}</p>
          )}
          {successMessage && (
            <p className="text-green-600 mt-3 text-center">{successMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
}
