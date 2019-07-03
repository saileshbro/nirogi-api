const pool = require("../database/database");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const nameValidator = require("../functions/validateName");
const passwordValidator = require("../functions/validatePassword");
const randomString = require("../functions/randomString");
module.exports.signup = async (req, res) => {
  const user = req.body;
  user.email = user.email.trim().toLowerCase();
  user.name = user.name.trim();
  try {
    if (user.name.length == 0) {
      return res.status(406).json({
        error: "Empty name provided."
      });
    }
    if (user.email.length == 0) {
      return res.status(406).json({
        error: "Empty email provided."
      });
    }
    if (user.password.length == 0) {
      return res.status(406).json({
        error: "Empty password provided."
      });
    }
    if (!validator.isEmail(user.email)) {
      return res.status(406).json({
        error: "Invalid email."
      });
    }

    if (!nameValidator.isNameValid(user.name)) {
      return res.status(406).json({
        error: "Invalid name"
      });
    }
    if (!passwordValidator.isPasswordValid(user.password)) {
      return res.status(406).json({
        error:
          "Required: Minimum eight characters, at least one letter, one number and one special character."
      });
    }
    const users = await pool.query("SELECT * FROM users WHERE email=?", [
      user.email
    ]);
    if (users.length != 0) {
      return res.status(409).json({
        error: "Email already registered"
      });
    }
    user.password = await bcrypt.hash(
      user.password,
      parseInt(process.env.SALT_ROUNDS)
    );
    const result = await pool.query(
      "INSERT INTO users SET name=?,email=?,password=?,imageUrl=?",
      [user.name, user.email, user.password, "public/images/profile.png"]
    );

    const token = await jwt.sign(
      {
        user_id: result.insertId
      },
      process.env.JWT_SECRET
    );
    delete user.password;

    return res.json({
      user_id: result.insertId,
      ...user,
      token
    });
  } catch (error) {
    return res.status(500).json({
      error
    });
  }
};

module.exports.login = async (req, res) => {
  const user = req.body;
  user.email = user.email.trim().toLowerCase();
  try {
    if (user.email.length == 0) {
      return res.status(406).json({
        error: "Empty email provided."
      });
    }
    if (user.password.length == 0) {
      return res.status(406).json({
        error: "Empty password provided."
      });
    }
    const result = await pool.query(
      "SELECT user_id,name,password,email,imageUrl,address,updated_at FROM users WHERE email=? LIMIT 1",
      [user.email]
    );
    if (result.length === 0) {
      return res.status(404).json({
        error: "Invalid email or password"
      });
    }
    const isMatch = await bcrypt.compare(user.password, result[0].password);
    if (!isMatch) {
      return res.status(404).json({
        error: "Invalid email or password"
      });
    }
    const token = await jwt.sign(
      {
        user_id: result[0].user_id
      },
      process.env.JWT_SECRET
    );
    delete result[0].password;
    return res.json({
      ...result[0],
      token
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error"
    });
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
module.exports.changepw = async (req, res) => {
  const currentpw = req.body.currentpw;
  let newpw = req.body.newpw;
  try {
    const user = await pool.query("SELECT * FROM users WHERE email=?", [
      req.user.email
    ]);
    if (!currentpw || currentpw.length == 0) {
      return res.status(406).json({
        error: "Empty currentpw provided."
      });
    }
    if (!newpw || newpw.length == 0) {
      return res.status(406).json({
        error: "Empty newpw provided."
      });
    }
    const isMatch = await bcrypt.compare(currentpw, user[0].password);
    if (!isMatch) {
      return res.status(404).json({
        error: "Current password didn't match."
      });
    }
    if (!passwordValidator.isPasswordValid(newpw)) {
      return res.status(406).json({
        error:
          "Required: Minimum eight characters, at least one letter, one number and one special character."
      });
    }
    newpw = await bcrypt.hash(newpw, parseInt(process.env.SALT_ROUNDS));
    const result = await pool.query(
      "UPDATE users SET password=? WHERE email=?",
      [newpw, req.user.email]
    );

    if (result.affectedRows == 1) {
      return res.send({
        message: "Password changed sucessfully"
      });
    } else if (result.affectedRows == 0) {
      return res.status(403).send({
        message: "Failed to update password"
      });
    }
  } catch (error) {
    return res.status(500).send({
      error: "Internal server error."
    });
  }
};
module.exports.forgot = async (req, res) => {
  const email = req.body.email;
  const random = randomString(10);
  try {
    if (!email) {
      return res.status(403).send({
        error: "Please provide an email address"
      });
    }
    const result = await pool.query("SELECT * FROM users WHERE email=?", [
      email
    ]);
    // res.send(result);
    if (result.length == 0) {
      return res.status(403).send({
        error: "Email not associated to any account"
      });
    } else if (result.length == 1) {
      // send reset email here
      const update = await pool.query(
        "UPDATE users SET fcode=? WHERE email=?",
        [random, email]
      );
      // send mail here
      return res.send({
        fcode: random
      });
    }
  } catch (error) {
    return res.status(500).send({
      error: "Internal server error."
    });
  }
};
