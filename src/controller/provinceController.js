const pool = require("../database/database");
module.exports.getProvinces = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT title,province_id,imageUrl FROM province ORDER BY title DESC"
    );
    if (result.length == 0) {
      return res.status(404).send({
        error: "No provinces found!"
      });
    }
    return res.send({
      provinces: result
    });
  } catch (error) {
    console.log(error);
    return res.send(500).send({
      error: "Internal server error."
    });
  }
};
module.exports.addProvince = async (req, res) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const body = req.body.body;
  try {
    const insert = await pool.query(
      "INSERT INTO province SET title=?,imageUrl=?,body=?",
      [title, imageUrl, body]
    );
    if (insert.affectedRows == 1) {
      return res.send({
        id: insert.insertId,
        message: "Sucessfully inserted"
      });
    }
    return res.send(406).send({
      error: "Unable to insert province"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      error: "Internal server error."
    });
  }
};
module.exports.getProvince = async (req, res) => {
  const province_id = req.params.province_id;
  try {
    const result = await pool.query(
      "SELECT * FROM province WHERE province_id=?",
      [province_id]
    );
    if (result.length == 0) {
      return res.status(404).send({
        error: "Province not found"
      });
    }
    return res.send(result[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      error: "Internal server error."
    });
  }
};
