import React from "react";
import { useState, useEffect } from "react";
import { userApi } from "../services/api";
import { useRouter } from "next/router";
import { useAuth } from "../context/authContext";
import { UserInformation } from "../types/loginCreds";
import { compareSync } from "bcrypt-ts";

// Login component for user authentication
export default function login() {
  const router = useRouter();
  const { login } = useAuth();

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [success, setSuccess] = useState("");

  //Function to store regex for email validation. The validation happens in handle functions later on.
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  //Function to store regex for password validation. The validation happens in handle functions later on.
  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isLongEnough = password.length >= 8;

    return hasUpperCase && hasLowerCase && hasNumber && isLongEnough;
  };

  /**checkLogin checks whether the login credentials provided already exists in the respective localStorage keys.
   * Returns a boolean value upon doing so**/
  const checkLogin = async (email: string, password: string) => {
    const allUsers = (await userApi.getAllUsers()) as UserInformation[];
    return allUsers.find(
      (user: UserInformation) =>
        user.email === email && compareSync(password, user.password)
    );
  };

  //handleChange function sets the state of loginData as the user types into the textbox.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSuccess("");
    setErrors({ email: "", password: "" });
  };

  //handleSubmit function handles what happens when "Login" button is pressed.
  const handleSubmit = async (e: React.FormEvent<HTMLInputElement>) => {
    // Ensures the 'required' tags in the input HTML are checked first before button click is handled.
    if (!e.currentTarget.form?.checkValidity()) return;

    e.preventDefault();
    // Resets the errors stored whenever this function runs (when user types again).
    setErrors({ email: "", password: "" });

    let hasErrors = false;

    // Email and password validation (if not valid, store error messages to show the user.)
    if (!validateEmail(loginData.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email.",
      }));
      hasErrors = true;
      return;
    }

    if (!validatePassword(loginData.password)) {
      setErrors((prev) => ({
        ...prev,
        password:
          "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number.",
      }));
      hasErrors = true;
      return;
    }

    // If no errors are stored, and if the credentials exist in the database,
    // show a success message and take them to their respective page
    const currentUser = await checkLogin(loginData.email, loginData.password);

    if (currentUser) {
      login(loginData.email, loginData.password);
      // Check if the current user is a lecturer (tutor = false)
      if (currentUser.role == "Lecturer") {
        // Save the current lecturer's name in localStorage
        localStorage.setItem("lecturerName", currentUser.firstName);
        setSuccess("Welcome user! Redirecting...");
        setTimeout(() => router.push("/lecturer"), 1000);
      } else {
        setSuccess("Welcome user! Redirecting...");
        router.push("/tutor");
      }
    }

    // If the credentials are not found, show an error message
    if (!currentUser) {
      setErrors((prev) => ({
        ...prev,
        email: "Incorrect email or password.",
      }));
    }
  };

  return (
    //Renders login box component. Error handlings in place.
    <div>
      <div className="login-container">
        <form className="loginprot">
          <h2>Login</h2>

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="text"
            name="email"
            value={loginData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error">{errors.email}</p>}

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            required
          />

          {errors.password && <p className="error">{errors.password}</p>}

          <input type="submit" value="Login" onClick={handleSubmit} />

          {success && <p className="affirmative-prompt">{success}</p>}
        </form>
      </div>
    </div>
  );
}
