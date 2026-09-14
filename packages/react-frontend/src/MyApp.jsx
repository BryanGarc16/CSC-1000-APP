import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function removeOneCharacter(index) {
    delUser(characters[index])
      .then((res) => {
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      setCharacters((prev) => prev.filter((_, i) => i !== index));
    })
    .catch((error) => console.log(error));
  }

  function updateList(person) {
    postUser(person)
      .then((res) => {
        if (!res.ok) throw new Error(`Post failed: ${res.status}`);
        return res.json();
      })
      .then((newUser) => setCharacters((prev) => [...prev, newUser]))
      .catch((error) => console.log(error));
  }

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  function delUser(person) {
    const promise = fetch("Http://localhost:8000/users", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });
    return promise;
  }

  function postUser(person) {
    const promise = fetch("Http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}
export default MyApp;
