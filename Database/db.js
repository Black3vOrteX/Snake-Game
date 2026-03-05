const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",        // change if different
    password: "Venkysql@2008",
    database: "snake_game"
});

db.connect((err) => {
    if (err) {
        console.error("MySQL connection failed:", err);
    } else {
        console.log("Connected to MySQL");
    }
});

module.exports = db;