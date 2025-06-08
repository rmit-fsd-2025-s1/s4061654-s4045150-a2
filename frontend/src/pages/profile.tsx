import React, { use } from "react";
import Nav from "../components/NavBar";
import Footer from "../components/Footer";
import { userApi } from "@/services/api";
import { UserInformation } from "../types/loginCreds";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function profile() {
  const [user, setUser] = React.useState<UserInformation | null>(null);
  const [about, setAbout] = React.useState("");
  const [editing, setEditing] = React.useState(false);
  const [joinDate, setJoinDate] = React.useState("");
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

  useEffect(() => {
    if (user) {
      setAbout(user.about || "");
      // Format the join date as needed (e.g., "YYYY-MM-DD")
      if (user.createdAt) {
        const date = new Date(user.createdAt);
        setJoinDate(date.toLocaleDateString());
      }
    }
  }, [user]);

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
            <strong>About:</strong>
            {editing ? (
              <>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="border rounded p-2 w-full"
                />
                <button
                  onClick={async () => {
                    if (!user) return;
                    await userApi.updateUser(user.userid, { about });
                    setUser({ ...user, about });
                    setEditing(false);
                  }}
                  className="btn btn-primary mt-2"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setAbout(user?.about || "");
                    setEditing(false);
                  }}
                  className="btn btn-secondary mt-2 ml-2"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span>{user?.about || "—"}</span>
                <button
                  onClick={() => setEditing(true)}
                  className="btn btn-link ml-2"
                >
                  Edit
                </button>
              </>
            )}
          </div>
          <div className="profile-info">
            <strong>Join Date:</strong> <span>{joinDate}</span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
