const pool = require("../database/database");
module.exports.addBmiRecord = async (req, res) => {
    const user_id = req.user.user_id;
    const bmi = req.body.bmi;
    try {
        const insert = await pool.query('INSERT INTO bmi SET user_id=?,value=?', [user_id, bmi]);
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
        const result = await pool.query("SELECT value,created_at FROM bmi WHERE user_id=?", [user_id]);
        if (result.length == 0) {
            return res.status(404).send({ error: "No records found" });
        } else return res.send({ bmi: result });
    } catch (error) {
        return res.status(500).send({ error: "Internal server error." });
    }
};