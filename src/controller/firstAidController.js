const pool = require("../database/database");
module.exports.addFirstAid = async (req, res) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const body = req.body.body;
  try {
    const insert = await pool.query(
      "INSERT INTO firstaids SET title=?,body=?,imageUrl=?",
      [title, body, imageUrl]
    );
    if (insert.affectedRows == 1) {
      return res.send({ id: insert.insertId });
    } else {
      return res.send({ error: "Error inserting data" });
    }
  } catch (error) {
    return res.status(500).send({ error: "Internal server error." });
  }
};
module.exports.getFirstAids = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT first_aid_id,title,imageUrl FROM firstaids"
    );
    if (result.title == 0) {
      return res.status(404).send({ error: "No first aids found!" });
    }
    return res.send({ firstaids: result });
  } catch (error) {
    return res.status(500).send({ error: "Internal server error." });
  }
};
module.exports.getFirstAid = async (req, res) => {
  const first_aid_id = req.params.first_aid_id;
  try {
    const result = await pool.query(
      "SELECT * FROM firstaids WHERE first_aid_id=?",
      [first_aid_id]
    );
    if (result.length == 0) {
      return res.status(404).send({ error: "First aid not found!" });
    }
    return res.send(result[0]);
  } catch (error) {
    return res.status(500).send({ error: "Internal server error." });
  }
};
