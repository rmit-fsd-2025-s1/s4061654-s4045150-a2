import "../../styles/nav.css";
import { useAuth } from "../context/authContext";

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navLeft">
        <h1 className="logo">
          <a href="/">Teach Team</a>
        </h1>
        <ul className="leftLinks">
          {/*If tutor boolean in applicantInfo is true, show the apply for tutor link*/}
          {user && user.tutor ? (
            <li>
              <a href="/tutor">Apply For Tutor</a>
            </li>
          ) : null}
          {/*If tutor boolean in applicantInfo is false, show the apply for lecturer link*/}
          {user && !user.tutor ? (
            <li>
              <a href="/lecturer">Lecturer Dashboard</a>
            </li>
          ) : null}
        </ul>
      </div>

      <div className="rightLinks">
        {/*If user is logged in, show the welcome message and sign out button*/}
        {user ? (
          <div className="userWelcome">
            <p>Welcome, {user.name}!</p>
            <button
              onClick={() => {
                logout();
                window.location.href = "/";
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="authLinks">
            <ul className="authList">
              <li>
                <a href="/login" className="prototype">
                  Sign In
                </a>
              </li>
              <li>
                <a href="/signup" className="signupBox">
                  Sign Up
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
