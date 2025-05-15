import React, { useState } from "react";
import { userApi } from "../services/api";
import Router from "next/router";
import { genSaltSync, hashSync } from "bcrypt-ts";

export default function SignUpBox() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const salt = genSaltSync(10);
    const hashedPassword = hashSync(password, salt);

    const user = {
      userid: Math.floor(Math.random() * 1000000),
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString(),
      about: "",
    };
    await userApi.createUser(user);
    alert("User registered!");
    Router.push("/login");
  };

  return (
    <div>
      <div className="signup-container">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h2>Sign Up</h2>

          <label>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <label>I'm signing up as a</label>

          <input
            type="radio"
            value="Candidate"
            checked={role == "Candidate"}
            onChange={() => setRole("Candidate")}
          />
          <label>Tutor</label>
          <input
            type="radio"
            value="Lecturer"
            checked={role == "Lecturer"}
            onChange={() => setRole("Lecturer")}
          />
          <label>Lecturer</label>

          <label>Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {password !== confirmPassword && (
            <p className="error">Passwords do not match</p>
          )}

          <input type="submit" value="Register" />
        </form>
      </div>
    </div>
  );
}
