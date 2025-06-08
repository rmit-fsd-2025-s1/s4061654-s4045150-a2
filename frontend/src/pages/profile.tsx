import React, { use } from "react";
import Nav from "../components/NavBar";
import Footer from "../components/Footer";
import { userApi } from "@/services/api";
import { UserInformation } from "../types/loginCreds";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function profile() {
  const [user, setUser] = React.useState<UserInformation | null>(null);
  const router = useRouter();

  const profileData = async () => {
    const allUsers = (await userApi.getAllUsers()) as UserInformation[];
    const loggedInUser = JSON.parse(localStorage.getItem("loggedIn") || "{}");
    const findUser = allUsers.find(
      (u: UserInformation) => u.firstName == loggedInUser.name
    );

    if (findUser) {
      setUser(findUser);
    }
  };

  useEffect(() => {
    // Redirect if not logged in
    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn) {
      router.replace("/");
      return;
    }
    profileData();
  }, []);

  return (
    <div className="profile-page-bg">
      <Nav />
      <div className="profile-center">
        <div className="profile-card">
          <h1 className="profile-title">Profile</h1>
          <div className="profile-info">
            <strong>Name:</strong>{" "}
            <span>
              {user?.firstName} {user?.lastName}
            </span>
          </div>
          <div className="profile-info">
            <strong>Email:</strong> <span>{user?.email}</span>
          </div>
          <div className="profile-info">
            <strong>About:</strong> <span>{user?.about || "—"}</span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
