const pool = require("../database/database");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
module.exports.getUsers = async (req, res, next) => {
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

module.exports.signup = async (req, res, next) => {
  const user = req.body;
  try {
    if (!validator.isEmail(user.email)) {
      return res.status(406).send({ error: "Invalid email." });
    }
    if (!/^[A-Za-z\s]+$/.test(user.name)) {
      return res.status(406).send({ error: "Invalid name" });
    }
    let regName = /^(?:(?=.*[a-z])(?:(?=.*[A-Z])(?=.*[\d\W])|(?=.*\W)(?=.*\d))|(?=.*\W)(?=.*[A-Z])(?=.*\d)).{8,}$/;
    if (!regName.test(user.password)) {
      return res.status(406).send({
        error:
          "Required: Minimum eight characters, at least one letter, one number and one special character."
      });
    }
    user.password = await bcrypt.hash(
      user.password,
      parseInt(process.env.SALT_ROUNDS)
    );
    const users = await pool.query("SELECT * FROM users WHERE email=?", [
      user.email
    ]);
    if (users.length > 0) {
      return res.status(409).send({ error: "Email already registered" });
    }
    const result = await pool.query(
      "INSERT INTO users SET name=?,email=?,password=?",
      [user.name, user.email, user.password]
    );
    const token = await jwt.sign({ id: result.id }, process.env.JWT_SECRET);
    delete user.password;
    return res.send({ ...user, token });
  } catch (error) {
    return res.status(500).send({ error });
  }
};
module.exports.login = async (req, res) => {
  const user = req.body;
  console.log(user);
  const results = await pool.query("SELECT * FROM users WHERE email=?", [
    user.email
  ]);
  if (results.length >= 1) {
    return res.send({ error: "Invalid email or password" });
  }
};
