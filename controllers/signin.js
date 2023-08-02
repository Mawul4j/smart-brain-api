const handleSignin = (req, res, db, bcrypt) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json("Please provide both email and password.");
  }

  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      if (data.length === 0) {
        return res.status(400).json("Wrong email or password.");
      }

      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => {
            if (user.length === 0) {
              return res.status(404).json("User not found.");
            }
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json("Unable to get user."));
      } else {
        res.status(400).json("Wrong email or password.");
      }
    })
    .catch((err) => res.status(400).json("Wrong email or password."));
};

export default handleSignin;
