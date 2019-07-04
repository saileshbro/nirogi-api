const pool = require("../database/database");
const nameValidator = require("../functions/validateName");
const validator = require("validator");

module.exports.myProfile = async (req, res) => {
  const user_id = req.user.user_id;
  try {
    const result = await pool.query(
      "SELECT user_id,name,imageUrl,address,updated_at FROM users WHERE user_id=?",
      [user_id]
    );
    if (result.length == 0) {
      return res.status(404).send({
        error: "Unable to load profile."
      });
    }
    return res.send(result[0]);
  } catch (error) {
    return res.status(500).send({
      error: "Internal server error."
    });
  }
};
module.exports.viewProfile = async (req, res) => {
  const user_id = req.params.user_id;
  try {
    const result = await pool.query(
      "SELECT user_id,name,imageUrl,address,updated_at FROM users WHERE user_id=?",
      [user_id]
    );
    if (result.length == 0) {
      return res.status(404).send({
        error: "Profile not found"
      });
    }
    return res.send(result[0]);
  } catch (error) {
    return res.status(500).send({
      error: "Internal server error."
    });
  }
};
module.exports.getProfiles = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT user_id,name,imageUrl,address,created_at FROM users"
    );
    if (result.length == 0) {
      return res.status(404).send({
        error: "No profiles found"
      });
    }
    return res.send({
      users: result
    });
  } catch (error) {
    return res.status(500).send({
      error: "Internal server error."
    });
  }
};
module.exports.updateProfile = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const name = req.body.name;
    const email = req.body.email;
    const address = req.body.address || "";
    if (!name || !email || name.length == 0 || email.length == 0) {
      return res.status(403).send({
        error: "Cannot update an empty field."
      });
    }
    if (!nameValidator.isNameValid(name)) {
      return res.status(406).json({
        error: "Invalid name"
      });
    }
    if (!validator.isEmail(email)) {
      return res.status(406).json({
        error: "Invalid email."
      });
    }
    const result = await pool.query(
      "UPDATE users SET email=?,name=?,address=? WHERE user_id=?",
      [email.trim(), name.trim(), address.trim(), user_id]
    );
    if (result.affectedRows == 1) {
      return res.send({ message: "Updated successfully." });
    }
  } catch (error) {
    return res.status(500).send({
      error: "Internal server error."
    });
  }
};
module.exports.updateImage = async (req, res) => {
  const user_id = req.user.user_id;
  try {
    const result = await pool.query(
      "UPDATE users SET imageUrl=? WHERE user_id=?",
      [req.file.destination.replace("src/", "") + req.file.filename, user_id]
    );
    if (result.affectedRows == 1) {
      return res.send({
        message: "Avatar changed"
      });
    } else {
      return res.status(422).send({
        error: "Unable to change avatar"
      });
    }
  } catch (error) {
    return res.status(500).send({
      error: "Internal server error."
    });
  }
};
