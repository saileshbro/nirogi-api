const pool = require("../database/database");
module.exports.getDiseases = async (req, res) => {
  try {
    const results = await pool.query(
      "SELECT disease_id,disease,imageUrl,description FROM diseases ORDER BY disease ASC"
    );
    if (results.length === 0) {
      return res.status(404).json({
        error: "Diseases not found"
      });
    }
    return res.json({
      diseases: results
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error"
    });
  }
};
module.exports.getSearchDiseases = async (req, res) => {
  const query = req.params.search;
  try {
    const results = await pool.query(
      `SELECT disease_id,disease,imageUrl,description FROM diseases WHERE disease LIKE "%${query}%" ORDER BY disease ASC`
    );
    if (results.length === 0) {
      return res.status(404).json({
        diseases: []
      });
    }
    return res.json({
      diseases: results
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error"
    });
  }
};
module.exports.getDisease = async (req, res) => {
  const disease_id = req.params.disease_id;
  try {
    const results = await pool.query(
      "SELECT disease_id,disease,imageUrl,body FROM diseases WHERE disease_id=?",
      [disease_id]
    );
    if (results.length === 0) {
      return res.status(404).json({
        error: "Diseases not found"
      });
    }
    return res.json(results[0]);
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error"
    });
  }
};
module.exports.addDiseases = async (req, res) => {
  const disease = req.body.disease;
  const description = req.body.description;
  const imageUrl = req.body.imageUrl;
  const body = req.body.body;
  try {
    const count = await pool.query("SELECT * FROM diseases WHERE disease=?", [
      disease
    ]);
    if (count.length != 0) {
      return res.status(403).json({
        error: "Disease already exists."
      });
    } else {
      const insert = await pool.query(
        "INSERT INTO diseases SET disease=?,body=?,imageUrl=?,description=?",
        [disease, body, imageUrl, description]
      );
      if (insert.affectedRows == 1) {
        return res.send({
          message: "Sucessfully inserted",
          id: insert.insertId
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error"
    });
  }
};
module.exports.updateDisease = async (req, res) => {
  const disease_id = req.params.disease_id;
  const body = req.body.body;
  const result = await pool.query(
    "UPDATE diseases SET body=? WHERE disease_id=?",
    [body, disease_id]
  );
  if (result) {
    return res.sendStatus(200);
  }
};
module.exports.topDiseases = async (req, res) => {
  try {
    const results = await pool.query(
      "SELECT disease_id,disease,imageUrl,description FROM diseases ORDER BY CHAR_LENGTH(body) DESC LIMIT 8"
    );
    if (results.length === 0) {
      return res.status(404).json({
        error: "Diseases not found"
      });
    }
    return res.json({
      diseases: results
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error"
    });
  }
};
