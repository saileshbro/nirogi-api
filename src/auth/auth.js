const jwt = require("jsonwebtoken");
const pool = require("../database/database");
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await pool.query("SELECT * FROM users WHERE id=?", [
      decoded.id
    ]);
    if (user.length === 0) {
      throw new Error();
    }
    req.token = token;
    req.user = user[0];
    console.log(req.token, req.user);
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate" });
  }
};
module.exports = auth;
