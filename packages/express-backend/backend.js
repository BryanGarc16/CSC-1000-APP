import express from "express";
import cors from "cors";
import userService from "./services/user-service.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users") // connect to Db "users"
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
/*
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
*/
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  userService
    .getUsers(name, job)
    .then((result) => {
      res.send({ users_list: result });
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  userService
    .findUserById(id)
    .then((result) => {
      if (result == NULL || result == undefined) {
        res.status(404).send("Resource not found");
      } else {
        res.send(result);
      }
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userService
    .addUser(userToAdd)
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((error) => {
      res.status(500).send(error.message);
    });
});

/*
app.delete("/users", (req, res) => {
  const userToDel = req.body;
  const deleted = deleteUser(userToDel.id);
  if (deleted === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.status(204).send();
  }
});
*/
app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  userService
    .removeUser(id)
    .then((result) => {
      if(result == NULL || result == undefined){
        res.status(404).send("Resource not found");
      }else{
        res.status(204).send();
      }
    })
    .catch((error) => {
      res.status(500).send(error.message);
    })
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
