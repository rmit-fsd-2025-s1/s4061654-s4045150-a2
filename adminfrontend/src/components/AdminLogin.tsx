import { userApi } from "../services/api";
import React, { useState } from "react";
import { useRouter } from "next/router";

export default function AdminLogin() {
  const [creds, setCreds] = useState({
    username: "",
    password: "",
  });
  const router = useRouter();
  const handleLogin = (username: string, password: string) => {
    userApi
      .adminLogin(username, password)
      .then((response) => {
        if (response) {
          alert("Login successful!");
          router.push("/course");
        } else {
          console.error("Login failed:", response);
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
      });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 w-full max-w-md h-full flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-xl font-semibold mb-4 text-black">Admin Login</h2>
      <p className="text-gray-600">Please log in to access admin features.</p>
      <form className="w-full mt-4">
        <input
          type="text"
          placeholder="Username"
          className="border p-2 w-full mb-4 text-black"
          onChange={(e) => setCreds({ ...creds, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4 text-black"
          onChange={(e) => setCreds({ ...creds, password: e.target.value })}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600"
          onClick={(e) => {
            e.preventDefault();
            // Handle login logic here
            handleLogin(creds.username, creds.password);
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
