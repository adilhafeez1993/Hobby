import { useState, useEffect, useRef } from "react";

import "./Hobbies.css";

export default function Hobbies({ userId }) {
  // states to store data
  const [passion, setPassion] = useState("");
  const [hobby, setHobby] = useState("");
  const [year, setYear] = useState("");

  // To Clear Input fields
  const passionRef = useRef("");
  const hobbyRef = useRef("");
  const yearRef = useRef("");

  //fetch data states
  const [data, setData] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  // Initially fetching hobbies from db
  useEffect(() => {
    getHobbies();
  }, []);

  const getHobbies = async () => {
    setIsPending(false);
    try {
      const res = await fetch("http://localhost:3000/info");
      if (!res) {
        throw new Error(res.statusText);
      }
      const data = await res.json();

      setData(data);
      setIsPending(false);
    } catch (err) {
      setError("couldnt fetch data");
      setIsPending(false);
    }
  };

  // Updating Hobbies according to the clicked user
  let updatedUsers = [];
  if (data) {
    data.forEach((user) => {
      if (user.userid === userId) {
        updatedUsers.push(user);
      }
    });
  }

  // Adding new hobby and clearing the input fields
  const handleHobby = (e) => {
    e.preventDefault();
    passionRef.current.value = "";
    hobbyRef.current.value = "";
    yearRef.current.value = "";
    addHobby();
  };

  const addHobby = async () => {
    setIsPending(true);
    try {
      const res = await fetch("http://localhost:3000/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passion: passion,
          hobby: hobby,
          year: year,
          userid: userId,
        }),
      });
      if (!res) {
        throw new Error(res.statusText);
      }
      const data = await res.json();

      setData((prevData) => {
        return [...prevData, data];
      });
      setIsPending(false);
      setError(null);
    } catch (err) {
      console.log("couldnot fetch data");
      setIsPending(false);
    }
  };

  // Deleting the respective hobby
  const handleDelete = (id) => {
    infoDelete(id);
  };

  const infoDelete = async (id) => {
    setIsPending(true);
    try {
      const res = await fetch(`http://localhost:3000/info/${id}`, {
        method: "DELETE",
      });
      if (!res) {
        throw new Error(res.statusText);
      }
      setData((prevData) => {
        const updatedArray = [...prevData];
        const filteredArray = updatedArray.filter((hobby) => hobby.id !== id);
        return filteredArray;
      });
      setIsPending(false);
      setError(null);
    } catch (err) {
      console.log("couldnot delete data");
      setError(err);
      setIsPending(false);
    }
  };
  return (
    <div>
      <p className="hobbies">Hobbies</p>
      <form onSubmit={handleHobby} className="form">
        <input
          ref={passionRef}
          type="text"
          placeholder="Passion - Low, Medium, High"
          onChange={(e) => {
            setPassion(e.target.value);
          }}
          required
        />
        <input
          ref={hobbyRef}
          type="text"
          placeholder="Hobby"
          onChange={(e) => {
            setHobby(e.target.value);
          }}
          required
        />
        <input
          type="number"
          ref={yearRef}
          placeholder="Start Year"
          onChange={(e) => {
            setYear(e.target.value);
          }}
          required
        />
        <button className="btn" type="submit">
          Add
        </button>
      </form>
      {isPending && <div>Looding...</div>}
      {error && <div>{error}</div>}
      {updatedUsers && (
        <div>
          {updatedUsers.map((info) => (
            <div key={info.id} style={{ display: "flex" }} className="info">
              <p>{info.passion}</p>
              <p>{info.hobby} </p>
              <p> {info.year}</p>
              <button
                className="btn-del"
                onClick={() => {
                  handleDelete(info.id);
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
