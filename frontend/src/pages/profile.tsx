import React, { use } from "react";
import Nav from "../components/NavBar";
import Footer from "../components/Footer";
import { userApi } from "@/services/api";
import { UserInformation } from "../types/loginCreds";
import { useEffect } from "react";

export default function profile() {
  const [user, setUser] = React.useState<UserInformation | null>(null);

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
    profileData();
  }, []);

  return (
    <div>
      <Nav />;<h1>Profile</h1>
      <p>Name: {user?.firstName}</p>
      <p>Email: {user?.email}</p>
      <p>About: {user?.about}</p>
      <Footer />;
    </div>
  );
}
