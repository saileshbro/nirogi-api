const pool = require("../database/database");
module.exports.getSymptoms = async (req, res) => {
    try {
        const results = await pool.query("SELECT symptom_id,symptom,imageUrl,description FROM symptoms ORDER BY symptom ASC");
        if (results.length === 0) {
            return res.status(404).json({
                error: "Symptoms not found"
            });
        }
        return res.json(results);
    } catch (error) {
        return res.status(500).json({
            error: "Internal server error"
        });
    }
};
module.exports.getSymptom = async (req, res) => {
    const symptom_id = req.params.symptom_id;
    try {
        const results = await pool.query("SELECT symptom_id,symptom,imageUrl,body FROM symptoms WHERE symptom_id=?", [symptom_id]);
        if (results.length === 0) {
            return res.status(404).json({
                error: "Symptoms not found"
            });
        }
        return res.json(results[0]);
    } catch (error) {
        return res.status(500).json({
            error: "Internal server error"
        });
    }
};
module.exports.addSymptoms = async (req, res) => {
    const symptom = req.body.symptom;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;
    const body = req.body.body;
    try {
        const count = await pool.query("SELECT * FROM symptoms WHERE symptom=?", [symptom]);
        if (count.length != 0) {
            return res.status(403).json({
                error: "Symptom already exists."
            });
        } else {
            const insert = await pool.query("INSERT INTO symptoms SET symptom=?,body=?,imageUrl=?,description=?", [symptom, body, imageUrl, description]);
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
module.exports.updateSymptom = async (req, res) => {
    const symptom_id = req.params.symptom_id;
    const body = req.body.body;
    const result = await pool.query("UPDATE symptoms SET body=? WHERE symptom_id=?", [body, symptom_id]);
    if (result) {
        return res.sendStatus(200);
    }
}