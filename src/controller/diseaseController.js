const pool = require("../database/database");
module.exports.getDiseases = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM diseases");
    if (results.length === 0) {
      return res.status(404).json({ error: "Diseases not found" });
    }
    return res.json(results);
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error"
    });
  }
};
module.exports.addDiseases = async (req, res) => {
  const disease = req.body;
  try {
    let result = await pool.query("SELECT * FROM diseases WHERE name=?", [
      disease.name.toLowerCase()
    ]);
    if (result.length > 0) {
      return res.json({ error: `${disease.name} already exists` });
    }
    result = await pool.query(
      "INSERT INTO diseases SET name=?,body=?,imageUrl=?",
      [disease.name, disease.body, disease.imageUrl]
    );
    if (!result.affectedRows) {
      return res.json({ error: "Error occured while inserting" });
    }
    res.json(disease);
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error."
    });
  }
};
