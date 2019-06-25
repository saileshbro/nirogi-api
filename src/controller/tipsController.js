const pool = require('../database/database');
module.exports.addFood = async (req, res) => {
    const name = req.body.name;
    const imageUrl = req.body.imageUrl || "";
    try {
        const result = await pool.query("INSERT INTO food SET name=?,imageUrl=?", [name, imageUrl]);
        if (!result) {
            return res.status(500).send({
                error: "Unable to add food"
            });
        }
        if (result.affectedRows == 1) {
            return res.send({
                message: "Sucessfully added.",
                id: result.insertId
            });
        }
    } catch (error) {
        return res.status(500).send({
            error: "Internal server error"
        });
    }
};
module.exports.addToDisease = async (req, res) => {
    const disease_id = req.body.disease_id;
    const toeat = req.body.toeat;
    const toavoid = req.body.toavoid;
    let eater = 0;
    let avoider = 0;
    try {
        if (toeat.length > 0) {
            for (let i = 0; i < toeat.length; i++) {
                const insert = await pool.query("INSERT INTO tips SET food_id=?,disease_id=?,value=?", [toeat[i], disease_id, 1]);
                if (insert.affectedRows == 1) {
                    eater++;
                }
            }

        } else {
            console.log("To-Eat empty");
        }
        if (toavoid.length > 0) {
            for (let i = 0; i < toavoid.length; i++) {
                const insert = await pool.query("INSERT INTO tips SET food_id = ? , disease_id = ? , value = ? ", [toavoid[i], disease_id, -1]);
                if (insert.affectedRows == 1) {
                    avoider++;
                }
            }

        }
        return res.send({
            toeat: eater,
            toavoid: avoider
        });

    } catch (error) {
        return res.sendStatus(500);
    }
};
module.exports.getDiseases = async (req, res) => {
    try {
        const result = await pool.query(`
        SELECT DISTINCT d.disease_id, d.disease, d.imageUrl 
        FROM diseases AS d 
        INNER JOIN tips AS t 
        USING(disease_id) 
        ORDER BY d.disease
        `);
        if (result.length == 0) {
            return res.status(404).send({
                error: "No diseases found."
            });
        } else return res.send({
            diseases: result
        });
    } catch (error) {
        return res.status(500).send({
            error: "Internal server error."
        });
    }
};
module.exports.getTips = async (req, res) => {
    const disease_id = req.params.disease_id;
    try {
        const result = await pool.query(`SELECT f.name,f.imageUrl,t.value 
                                    From food AS f 
                                    INNER JOIN tips AS t 
                                    ON f.food_id=t.food_id 
                                    INNER JOIN diseases AS d 
                                    on t.disease_id=d.disease_id 
                                    WHERE d.disease_id=?`, [disease_id]);
        const toeat = result.filter(tip => tip.value == 1);
        toeat.forEach(tip => {
            delete tip.value;
        });
        const toavoid = result.filter(tip => tip.value == -1);
        toavoid.forEach(tip => {
            delete tip.value;
        });
        return res.send({
            disease_id,
            toeat,
            toavoid
        });
    } catch (error) {
        return res.status(500).send({
            error: "Internal server error."
        });
    }

};