import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/authContext";

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

  /**checkLogin checks whether the login credentials provided already exists in the respective localStorage keys.
   * Returns a boolean value upon doing so**/

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
    setErrors({ email: "", password: "" });

    try {
      if (!loginData.email || !loginData.password) {
        setErrors((prev) => ({
          ...prev,
          empty: "Please fill in all fields.",
        }));
        return;
      }

      if (validateEmail(loginData.email)) {
        const successLogin = await login(loginData.email, loginData.password);
        if (!successLogin) {
          setErrors((prev) => ({
            ...prev,
            email: "Incorrect email or password.",
          }));
        } else {
          // Get user info from context or localStorage
          const loggedInUser = JSON.parse(
            localStorage.getItem("loggedIn") || "{}"
          );
          setSuccess(`Welcome ${loggedInUser.name}! Redirecting...`);
          if (loggedInUser.role === "Candidate") {
            router.push("/candidate");
          } else {
            router.push("/lecturer");
          }
        }
      } else {
        setErrors((prev) => ({
          ...prev,
          email: "Please enter a valid email.",
        }));
        return;
      }
    } catch (err) {
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

//helper functions

const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
