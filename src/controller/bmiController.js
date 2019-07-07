const pool = require("../database/database");
module.exports.addBmiRecord = async (req, res) => {
  const user_id = req.user.user_id;
  const bmi = req.body.value;
  console.log(req.body);
  try {
    const insert = await pool.query("INSERT INTO bmi SET user_id=?,value=?", [
      user_id,
      bmi
    ]);
    if (insert.affectedRows === 1) {
      return res.json({ message: "Saved successfully." });
    } else {
      return res.status(400).json({ error: "Unable to save." });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};
module.exports.getBmiHistory = async (req, res) => {
  const user_id = req.user.user_id;
  try {
    const result = await pool.query(
      "SELECT value,created_at FROM bmi WHERE user_id=?",
      [user_id]
    );
    if (result.length == 0) {
      return res.status(404).send({ bmi: [] });
    } else {
      const tosend = result.map(rslt => {
        const d = Date.parse(rslt.created_at);
        return {
          value: parseFloat(rslt.value.toFixed(2)),
          created_at: new Date(d)
            .toDateString()
            .split(" ")
            .slice(1)
            .join(" ")
        };
      });
      return res.send({
        bmi: tosend
      });
    }
  } catch (error) {
    return res.status(500).send({ error: "Internal server error." });
  }
};
module.exports.deleteBmiHistory = async (req, res) => {
  const user_id = req.user.user_id;
  try {
    const result = await pool.query("DELETE FROM bmi WHERE user_id=?", [
      user_id
    ]);
    if (result.affectedRows == 0) {
      return res.status(404).send({ error: "No records found" });
    } else {
      return res.json({ message: "sucessfully cleared" });
    }
  } catch (error) {
    return res.status(500).send({ error: "Internal server error." });
  }
};
