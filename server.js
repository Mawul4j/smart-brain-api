import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt-nodejs";
import cors from "cors";
import knex from "knex";

const db = knex({
  // Add your database configuration here
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "mawuloloameko",
    password: "",
    database: "smart-brain",
  },
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

const database = {
  users: [
    {
      id: "123",
      name: "mawulolo",
      email: "mawulolo@gmail.com",
      password: "orange",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "124",
      name: "orlane",
      email: "orlane@gmail.com",
      password: "mango",
      entries: 0,
      joined: new Date(),
    },
  ],
};

// --> res = this is working
app.get("/", (req, res) => {
  res.json(database.users);
});

//signin --> POST = sucess/fail
app.post("/signin", (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json("error logging in!");
  }
});

//register --> POST = user
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  db("users")
    .returning("*")
    .insert({
      email: email,
      name: name,
      joined: new Date(),
    })
    .then((user) => {
      res.json(user[0]);
    })
    .catch((err) => res.status(400).json("unable to register"));
});
//profile/:userId --> GET = user
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  db.select("*")
    .from("users")
    .where({ id: id })
    .then((user) => {
      // console.log(user);
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("user not found");
      }
    })
    .catch((err) => res.status(400).json("error getting user"));
});
//image --> PUT --> user
app.put("/image", (req, res) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0].entries);
    })
    .catch((err) => res.status(400).json("unable to update entries"));
});

// bcrypt.hash("bacon", null, null, function (err, hash) {
//   // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//   // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//   // res = false
// });

//listen on the portal
app.listen(3000, () => {
  console.log("don't worry your app is good!");
});
