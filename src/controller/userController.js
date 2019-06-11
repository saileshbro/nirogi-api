const pool = require("../database/database");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
module.exports.getUsers = async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM users");
    if (users.length === 0) {
      return res.send({
        error: "No users found."
      });
    }
    res.send(users);
  } catch (error) {
    res.send({
      error
    });
  }
};

module.exports.signup = async (req, res) => {
  const user = req.body;
  user.email = user.email.trim().toLowerCase();
  user.name = user.name.trim();
  console.log(user);
  try {
    if (user.name.length == 0) {
      return res.status(406).send({ error: "Empty name provided." });
    }
    if (user.email.length == 0) {
      return res.status(406).send({ error: "Empty email provided." });
    }
    if (user.password.length == 0) {
      return res.status(406).send({ error: "Empty password provided." });
    }
    if (!validator.isEmail(user.email)) {
      return res.status(406).send({ error: "Invalid email." });
    }
    let regName = /^[a-zA-Z][a-zA-Z\s]*$/;
    if (!regName.test(user.name)) {
      return res.status(406).send({ error: "Invalid name" });
    }
    regName = /^(?:(?=.*[a-z])(?:(?=.*[A-Z])(?=.*[\d\W])|(?=.*\W)(?=.*\d))|(?=.*\W)(?=.*[A-Z])(?=.*\d)).{8,}$/;
    if (!regName.test(user.password)) {
      return res.status(406).send({
        error:
          "Required: Minimum eight characters, at least one letter, one number and one special character."
      });
    }
    const users = await pool.query("SELECT * FROM users WHERE email=?", [
      user.email
    ]);
    if (users.length != 0) {
      return res.status(409).send({ error: "Email already registered" });
    }
    user.password = await bcrypt.hash(
      user.password,
      parseInt(process.env.SALT_ROUNDS)
    );
    const result = await pool.query(
      "INSERT INTO users SET name=?,email=?,password=?",
      [user.name, user.email, user.password]
    );
    const token = await jwt.sign(
      { id: result.insertId },
      process.env.JWT_SECRET
    );
    delete user.password;

    return res.send({ id: result.insertId, ...user, token });
  } catch (error) {
    return res.status(500).send({ error });
  }
};

module.exports.login = async (req, res) => {
  const user = req.body;
  user.email = user.email.trim().toLowerCase();
  console.log(user);
  try {
    if (user.email.length == 0) {
      return res.status(406).send({ error: "Empty email provided." });
    }
    if (user.password.length == 0) {
      return res.status(406).send({ error: "Empty password provided." });
    }
    const result = await pool.query(
      "SELECT * FROM users WHERE email=? LIMIT 1",
      [user.email]
    );
    if (result.length === 0) {
      return res.status(404).send({ error: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(user.password, result[0].password);
    if (!isMatch) {
      return res.status(404).send({
        error: "Invalid email or password"
      });
    }
    const token = await jwt.sign({ id: result[0].id }, process.env.JWT_SECRET);
    delete result[0].password;

    return res.send({ ...result[0], token });
  } catch (error) {
    return res.status(500).send({ error });
  }
};
