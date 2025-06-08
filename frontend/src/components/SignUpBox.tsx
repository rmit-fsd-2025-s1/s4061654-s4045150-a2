import React, { useState } from "react";
import { userApi } from "../services/api";
import Router from "next/router";

export default function SignUpBox() {
  // State to manage user credentials to be registered
  const [userCredentials, setuserCredentials] = useState({
    firstName: "",
    lastName: "",
    role: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  // State to manage errors and success messages
  // Errors include email, password, empty fields, and backend errors
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    empty: "",
    backend: "",
  });
  // State to manage success message after registration
  const [success, setSuccess] = useState("");

  // Function to handle changes in input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setuserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
    setErrors({ email: "", password: "", empty: "", backend: "" });
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    //Prevent defaults
    e.preventDefault();

    //store all the values that have been saved in the userCredentials state to a user object for registration
    const user = {
      userid: Math.floor(Math.random() * 1000000),
      firstName: userCredentials.firstName,
      lastName: userCredentials.lastName,
      email: userCredentials.email,
      password: userCredentials.password,
      role: userCredentials.role,
      createdAt: new Date(),
      about: "",
    };

    //If first name contains numbers or special characters, we set the error
    if (!validateName(userCredentials.firstName)) {
      setErrors({
        ...errors,
        empty:
          "Firstname must be at least 2 characters long and contain only letters",
      });
      return;
    }
    //If last name contains numbers or special characters, we set the error
    //Helper functions are at the bottom of the file
    if (!validateName(userCredentials.lastName)) {
      setErrors({
        ...errors,
        empty:
          "Lastname must be at least 2 characters long and contain only letters",
      });
      return;
    }
    //If the email entered is not valid (email@example.com), we set the error
    if (validateEmail(userCredentials.email)) {
      if (validatePassword(userCredentials.password)) {
        try {
          //If valid email and password, we proceed to register the user
          await userApi.createUser(user);
        } catch (err: any) {
          //If there is an error sent from the backend, we set the backend error
          setErrors((prev) => ({
            ...prev,
            backend:
              err?.response?.data?.message ||
              err?.message ||
              "Registration failed. Please try again later.",
          }));
          return;
        }
        //If registration is successful, show success message
        setTimeout(() => {
          Router.push("/login");
        }, 1000);
      } else {
        //If password is not valid (less than 8 characters, no uppercase, no lowercase, no number), we set the password error
        setErrors({
          ...errors,
          password:
            "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
        });
      }
    } else {
      //If email is not valid, we set the email error
      setErrors({
        ...errors,
        email: "Please enter a valid email",
      });
    }
    //If there are no errors, we set the success message
    if (!errors.empty || !errors.email || !errors.password) {
      setSuccess("You've been registered successfully!");
      return;
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
          {/*Shows name related errors */}
          {errors.empty && <p className="error">{errors.empty}</p>}

          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={userCredentials.lastName}
            onChange={handleChange}
          />
          {errors.empty && <p className="error">{errors.empty}</p>}

          <label>I'm signing up as a</label>
          <div className="role-radio-group">
            <input
              type="radio"
              value="Candidate"
              checked={userCredentials.role == "Candidate"}
              onChange={handleChange}
              name="role"
              id="role-candidate"
            />
            <label htmlFor="role-candidate">Tutor</label>
            <input
              type="radio"
              value="Lecturer"
              checked={userCredentials.role == "Lecturer"}
              onChange={handleChange}
              name="role"
              id="role-lecturer"
            />
            <label htmlFor="role-lecturer">Lecturer</label>
          </div>
          {/*Radio buttons for selecting user role*/}
          <input
            type="radio"
            value="Candidate"
            checked={userCredentials.role == "Candidate"}
            onChange={handleChange}
            name="role"
          />
          <label>Candidate</label>
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
          {/*The Sign Up button will stay disabled if all input fields are not filled in */}
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
          {errors.backend && <p className="error">{errors.backend}</p>}
          {success && <p className="affirmative-prompt">{success}</p>}
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

const validateName = (name: string) => {
  return /^[A-Za-z]{2,}$/.test(name);
};
