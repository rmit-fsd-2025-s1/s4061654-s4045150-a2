import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/authContext";

export default function login() {
  //Router declaration to allow for redirection after login
  const router = useRouter();
  //Login auth context
  const { login } = useAuth();

  //All errors are stored in the error state
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  //Email and password are stored in the loginData state
  //This state is updated as the user types into the input fields
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  //Success message is stored in the success state
  const [success, setSuccess] = useState("");

  //handleChange function sets the state of loginData as the user types into the textbox.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    //Login data changing as user types
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));

    //As user types, we reset the error messages
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
      //If email or password is empty, we set the error message
      if (!loginData.email || !loginData.password) {
        setErrors((prev) => ({
          ...prev,
          empty: "Please fill in all fields.",
        }));
        return;
      }
      //If email is valid, we call the login function from authContext
      if (validateEmail(loginData.email)) {
        const successLogin = await login(loginData.email, loginData.password);

        // If login fails, we set the error message
        if (!successLogin) {
          setErrors((prev) => ({
            ...prev,
            email: "Incorrect email or password.",
          }));
          return;
        }

        // Get user info from context or localStorage
        const loggedInUser = JSON.parse(
          localStorage.getItem("loggedIn") || "{}"
        );
        //Set success message and redirect user to the appropriate page based on their role
        //Success message contains the name of the user
        setSuccess(`Welcome ${loggedInUser.name}! Redirecting...`);
        if (loggedInUser.role === "Candidate") {
          router.push("/candidate");
        } else {
          router.push("/lecturer");
        }
      } else {
        //If email is not valid, we set the error message
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
