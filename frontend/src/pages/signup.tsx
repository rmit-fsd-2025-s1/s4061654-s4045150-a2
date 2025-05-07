import React from "react";
import Nav from "./components/NavBar";
import Footer from "./components/Footer";
import "../styles/signup.css";

export default function Signup() {
  return (
    <div>
      <Nav />
      <div className="signup-container">
        <form className="signup-form">
          <h2>Sign Up</h2>

          <label>Name</label>
          <input type="text" />

          <label>I'm applying to be a</label>
          <div className="whoami">
            <button>Tutor</button>
            <button>Lecturer</button>
          </div>

          <label>Email</label>
          <input type="text" />

          <label>Password</label>
          <input type="password" />

          <input type="submit" value="Register" />
        </form>
      </div>
      <Footer />
    </div>
  );
}
