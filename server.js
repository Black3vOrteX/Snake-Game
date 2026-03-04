const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./Database/db");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));


app.post("/save-score", (req, res) => {
    const { username, score } = req.body;

    console.log("Saving to DB:", username, score);

    if (!username || score === undefined) {
        return res.status(400).json({ message: "Invalid data" });
    }

    const sql = `
    INSERT INTO leaderboard (username, score)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE
    score = GREATEST(score, VALUES(score))
`;
    db.query(sql, [username.trim(), score], (err) => {
        if (err) {
            console.error("DB Error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        res.json({ message: "Score processed" });
    });
});


app.get("/leaderboard", (req, res) => {
    const sql = `
        SELECT username, score
        FROM leaderboard
        ORDER BY score DESC
        LIMIT 10
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        res.json(results);
    });
});


app.listen(3000, () => {
    console.log("Server running on http://127.0.0.1:3000");
});