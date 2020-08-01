const pool = require("../database/database");
const timeago = require("../functions/timeAgo");
module.exports.getAllNews = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT news_id,title,imageUrl,description,written_by,NOW()-updated_at AS updated_at FROM news ORDER BY updated_at"
    );
    if (result.length == 0) {
      return res.status(404).send({
        error: "News not found!"
      });
    }
    result.forEach(rslt => (rslt.updated_at = timeago(rslt.updated_at)));
    return res.send({
      news: result
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      error: "Internal server error."
    });
  }
};
module.exports.getNewsItem = async (req, res) => {
  const news_id = req.params.news_id;
  try {
    const result = await pool.query(
      "SELECT news_id,title,imageUrl,description,body,written_by,NOW()-updated_at AS updated_at FROM news WHERE news_id=?",
      [news_id]
    );
    if (result.length == 0) {
      return res.status(404).send({
        error: "News not found!"
      });
    }
    result.forEach(rslt => (rslt.updated_at = timeago(rslt.updated_at)));
    return res.send(result[0]);
  } catch (error) {
    console.log(error);
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
    console.log(error);
    return res.status(500).send({
      error: "Internal server error."
    });
  }
};
