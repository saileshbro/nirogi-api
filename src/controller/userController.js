const pool = require("../database/database");
const validator = require("validator");
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

module.exports.createUser = async (req, res, next) => {
  try {
    if (!validator.isEmail(req.body.email)) {
      return res.status(406).send({ error: "Invalid email." });
    }
    if (!/^[A-Za-z\s]+$/.test(req.body.name)) {
      return res.status(406).send({ error: "Invalid name" });
    }
    let regName = /^(?:(?=.*[a-z])(?:(?=.*[A-Z])(?=.*[\d\W])|(?=.*\W)(?=.*\d))|(?=.*\W)(?=.*[A-Z])(?=.*\d)).{8,}$/;
    if (!regName.test(req.body.password)) {
      return res.status(406).send({
        error:
          "Required: Minimum eight characters, at least one letter, one number and one special character."
      });
    }
    return res.send({ message: "User created" });
  } catch (error) {
    return res.status(500).send({ error });
  }
};
