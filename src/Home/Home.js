import { useState } from "react";

import UserList from "../components/UserList";
import Hobbies from "../components/Hobbies";

export default function Home() {
  const [userId, setUserId] = useState("");
  return (
    <div style={{ display: "flex", justifycontent: "center" }}>
      <UserList setUserId={setUserId} />
      <Hobbies userId={userId} />
    </div>
  );
}
