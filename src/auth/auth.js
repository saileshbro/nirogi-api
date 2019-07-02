const jwt = require("jsonwebtoken");
const pool = require("../database/database");
const auth = async (req, res, next) => {
  try {
    if (
      !req.header("Authorization") ||
      req.header("Authorization") === "Bearer null"
    ) {
      return res.status(401).json({ error: "Please authenticate" });
    }
    const token = req.header("Authorization").replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await pool.query("SELECT * FROM users WHERE user_id=?", [
      decoded.user_id
    ]);
    if (user.length === 0) {
      return res.status(401).json({ error: "Please authenticate" });
    }
    req.token = token;
    req.user = user[0];
    delete req.user.password;
    delete req.user.created_at;
    delete req.user.updated_at;
    next();
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = auth;
