let sql;

const sqlite3 = require("sqlite3").verbose();

// connect to the sqlite database
const db = new sqlite3.Database("./passwordDataBase.db", sqlite3.OPEN_READWRITE,(err) => {
    if (err) return console.error(err.message);
})

sql = `CREATE TABLE contacts_information(accessId INTEGER,contactId,userName,email,age,address,image)`
db.run(sql);
