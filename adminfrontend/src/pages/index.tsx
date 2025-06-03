import { useState, useEffect } from "react";
import { userApi } from "../services/api";

type UserInformation = {
  userid: number;
  firstName: string;
  email: string;
};

export default function Home() {
  const [users, setUsers] = useState<UserInformation[]>([]);

  useEffect(() => {
    userApi.getAllUsers().then((data) => setUsers(data));
  }, []);

  return (
    <div>
      <h1>All users</h1>
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.userid}>
              {user.firstName} - {user.email}
            </li>
          ))}
        </ul>
      ) : (
        <h1>No users</h1>
      )}
    </div>
  );
}
