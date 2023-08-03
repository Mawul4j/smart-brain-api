import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt-nodejs";
import cors from "cors";
import knex from "knex";
import handleRegister from "./controllers/register.js";
import handleSignin from "./controllers/signin.js";
import handleProfileGet from "./controllers/profile.js";
import handleImageEntries from "./controllers/image.js";
import handleAPICall from "./controllers/imageurl.js";

const db = knex({
  // Add your database configuration here
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  },
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json("App running successfully!");
});

//signin --> POST = sucess/fail
app.post("/signin", (req, res) => {
  handleSignin(req, res, db, bcrypt);
});

//register --> POST = user
app.post("/register", (req, res) => {
  handleRegister(req, res, db, bcrypt);
});
//profile/:userId --> GET = user
app.get("/profile/:id", (req, res) => {
  handleProfileGet(req, res, db);
});
//image --> PUT --> user
app.put("/image", (req, res) => {
  handleImageEntries(req, res, db);
});

app.post("/imageurl", (req, res) => {
  handleAPICall(req, res);
});

//listen on the portal
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
