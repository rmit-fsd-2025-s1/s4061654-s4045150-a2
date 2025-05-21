import React, { useState } from "react";
import { userApi } from "../services/api";
import Router from "next/router";

export default function SignUpBox() {
  const [userCredentials, setuserCredentials] = useState({
    firstName: "",
    lastName: "",
    role: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    empty: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setuserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
    setErrors({ email: "", password: "", empty: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = {
      userid: Math.floor(Math.random() * 1000000),
      firstName: userCredentials.firstName,
      lastName: userCredentials.lastName,
      email: userCredentials.email,
      password: userCredentials.password,
      role: userCredentials.role,
      createdAt: new Date().toISOString(),
      about: "",
    };
    if (validateEmail(userCredentials.email)) {
      if (validatePassword(userCredentials.password)) {
        await userApi.createUser(user);
        alert("User registered!");
        Router.push("/login");
      } else {
        setErrors({
          ...errors,
          password:
            "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
        });
      }
    } else {
      setErrors({
        ...errors,
        email: "Please enter a valid email",
      });
    }
  };

  return (
    <div>
      <div className="signup-container">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h2>Sign Up</h2>

          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={userCredentials.firstName}
            onChange={handleChange}
          />

          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={userCredentials.lastName}
            onChange={handleChange}
          />

          <label>I'm signing up as a</label>

          <input
            type="radio"
            value="Candidate"
            checked={userCredentials.role == "Candidate"}
            onChange={handleChange}
            name="role"
          />
          <label>Tutor</label>
          <input
            type="radio"
            value="Lecturer"
            checked={userCredentials.role == "Lecturer"}
            onChange={handleChange}
            name="role"
          />
          <label>Lecturer</label>

          <label>Email</label>
          <input
            type="text"
            name="email"
            value={userCredentials.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={userCredentials.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error">{errors.password}</p>}

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={userCredentials.confirmPassword}
            onChange={handleChange}
          />

          {userCredentials.password !== userCredentials.confirmPassword && (
            <p className="error">Passwords do not match</p>
          )}

          <input
            type="submit"
            value="Register"
            disabled={
              !userCredentials.firstName ||
              !userCredentials.lastName ||
              !userCredentials.role ||
              !userCredentials.email ||
              !userCredentials.password ||
              !userCredentials.confirmPassword ||
              userCredentials.password !== userCredentials.confirmPassword
            }
          />
        </form>
      </div>
    </div>
  );
}

// Helper functions
const validatePassword = (password: string) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const isLongEnough = password.length >= 8;

  return hasUpperCase && hasLowerCase && hasNumber && isLongEnough;
};

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
