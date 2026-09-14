import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};

app.use(cors());
app.use(express.json());

const createID = () => {
  let newID = "";
  for (let ii = 0; ii < 3; ii++) {
    newID += String.fromCharCode(
      Math.floor(Math.random() * (122 - 97 + 1)) + 97,
    );
  }
  for (let ii = 0; ii < 3; ii++) {
    newID += String.fromCharCode(
      Math.floor(Math.random() * (57 - 48 + 1)) + 48,
    );
  }
  return newID;
};

const addUser = (user) => {
  if (user.id == undefined || user.id == ""){
    user.id = createID();
  }
  users["users_list"].push(user);
  return user;
};

const deleteUser = (id) => {
  const index = users["users_list"].findIndex((user) => user["id"] === id);
  if (index === -1) return undefined;
  const [deleted] = users["users_list"].splice(index, 1);
  return deleted;
};

const findUserByName = (name) => {
  return users["users_list"].filter((user) => user["name"] === name);
};

const findUserByJob = (job) => {
  return users["users_list"].filter((user) => user["job"] === job);
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  if (name != undefined) {
    let result = findUserByName(name);
    if (job != undefined) {
      result = findUserByJob(job);
    }
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  addUser(userToAdd);
  res.status(201).send(userToAdd);
});

app.delete("/users", (req, res) => {
  const userToDel = req.body;
  const deleted = deleteUser(userToDel.id);
  if (deleted === undefined) {
    res.status(404).send("Resource not found.");
  } else 
  {
  res.status(204).send();
  }
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"]; 
  let deleted = deleteUser(id);
  if (deleted === undefined) {
    res.status(404).send("Resource not found.");
  } else 
  {
    res.status(204).send();
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
