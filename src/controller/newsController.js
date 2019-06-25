const pool = require("../database/database");
module.exports.getAllNews = async (req, res) => {
  try {
    const result = await pool.query("SELECT news_id,title,imageUrl,description,written_by FROM news ORDER BY updated_at");
    return res.send({
      news: result
    });
  } catch (error) {
    return res.status(500).send({
      error: "Internal server error."
    });
  }
};
module.exports.addNews = async (req, res) => {
  const title = req.body.title;
  const body = req.body.body;
  const description = req.body.description;
  const imageUrl = req.body.imageUrl || "";
  const written_by = req.body.written_by || "Nirogi Team";
  if (
    !title ||
    !body ||
    !description ||
    title.length == 0 ||
    body.length == 0 ||
    description == 0
  ) {
    return res.status(403).send({
      error: "Cannot create a post"
    });
  }
  try {
    const insert = await pool.query(
      "INSERT INTO news SET title=?,body=?,description=?,imageUrl=?,written_by=?",
      [title, body, description, imageUrl, written_by]
    );
    if (insert.affectedRows == 1) {
      return res.send({
        message: "Sucessfully inserted",
        id: insert.insertId
      });
    }
  } catch (error) {
    return res.status(500).send({
      error: "Internal server error."
    });
  }
};