import { useEffect, useState, useRef } from "react";
import "./UserList.css";

export default function UserList({ setUserId }) {
  const [newUser, setNewUser] = useState("");
  const inputRef = useRef();

  // fetch data states
  const [users, setUsers] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  // Initially gets users from db
  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    setIsPending(false);
    try {
      const res = await fetch("http://localhost:3000/users");
      if (!res) {
        throw new Error(res.statusText);
      }
      const data = await res.json();
      setUsers(data);
      setIsPending(false);
    } catch (err) {
      setError("couldnt fetch data");
      setIsPending(false);
    }
  };

  // Adds new user to db
  const handleAdd = () => {
    inputRef.current.value = "";
    addUser();
  };
  const addUser = async () => {
    setIsPending(true);
    try {
      const res = await fetch("http://localhost:3000/users", {
        method: "POST",
        body: JSON.stringify({ userName: newUser }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res) {
        throw new Error(res.statusText);
      }
      const data = await res.json();
      if (!data) {
        throw new Error("new User not Found");
      }
      setUsers((prevUsers) => {
        return [...prevUsers, data];
      });
      setIsPending(false);
    } catch (err) {
      setError("couldnt fetch data");
      console.log(err);
      setIsPending(false);
    }
  };

  return (
    <div className="userContent">
      {isPending && <div>Looding...</div>}
      {error && <div>{error}</div>}
      {users && (
        <div>
          <p className="users">Users</p>
          <div>
            <input
              type="text"
              ref={inputRef}
              required
              placeholder="Enter a new User"
              onChange={(e) => {
                setNewUser(e.target.value);
              }}
            />
            <button
              className="btn"
              onClick={() => {
                handleAdd();
              }}
            >
              Add
            </button>
          </div>
          {users.map((user) => (
            <div key={user.id}>
              <p
                className="user"
                onClick={() => {
                  setUserId(user.id);
                }}
              >
                {user.userName}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
