const pool = require("../database/database");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
module.exports.getUsers = async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM users");

    if (users.length === 0) {
      return res.json({
        error: "No users found."
      });
    }
    res.json(users);
  } catch (error) {
    res.json({
      error
    });
  }
};

module.exports.signup = async (req, res) => {
  const user = req.body;
  user.email = user.email.trim().toLowerCase();
  user.name = user.name.trim();
  try {
    if (user.name.length == 0) {
      return res.status(406).json({ error: "Empty name provided." });
    }
    if (user.email.length == 0) {
      return res.status(406).json({ error: "Empty email provided." });
    }
    if (user.password.length == 0) {
      return res.status(406).json({ error: "Empty password provided." });
    }
    if (!validator.isEmail(user.email)) {
      return res.status(406).json({ error: "Invalid email." });
    }
    let regName = /^[a-zA-Z][a-zA-Z\s]*$/;
    if (!regName.test(user.name)) {
      return res.status(406).json({ error: "Invalid name" });
    }
    regName = /^(?:(?=.*[a-z])(?:(?=.*[A-Z])(?=.*[\d\W])|(?=.*\W)(?=.*\d))|(?=.*\W)(?=.*[A-Z])(?=.*\d)).{8,}$/;
    if (!regName.test(user.password)) {
      return res.status(406).json({
        error:
          "Required: Minimum eight characters, at least one letter, one number and one special character."
      });
    }
    const users = await pool.query("SELECT * FROM users WHERE email=?", [
      user.email
    ]);
    if (users.length != 0) {
      return res.status(409).json({ error: "Email already registered" });
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
      { user_id: result.insertId },
      process.env.JWT_SECRET
    );
    delete user.password;

    return res.json({ user_id: result.insertId, ...user, token });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

module.exports.login = async (req, res) => {
  const user = req.body;
  user.email = user.email.trim().toLowerCase();
  try {
    if (user.email.length == 0) {
      return res.status(406).json({ error: "Empty email provided." });
    }
    if (user.password.length == 0) {
      return res.status(406).json({ error: "Empty password provided." });
    }
    const result = await pool.query(
      "SELECT * FROM users WHERE email=? LIMIT 1",
      [user.email]
    );
    if (result.length === 0) {
      return res.status(404).json({ error: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(user.password, result[0].password);
    if (!isMatch) {
      return res.status(404).json({
        error: "Invalid email or password"
      });
    }
    const token = await jwt.sign(
      { user_id: result[0].user_id },
      process.env.JWT_SECRET
    );
    delete result[0].password;

    return res.json({ ...result[0], token });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
module.exports.logout = async (req, res) => {
  delete req.token;
  delete req.user;
  res.json({
    message: "Logged out.",
    token: ""
  });
};
