const express = require('express');
const app = new express();
app.use(require("body-parser").json())
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./data.db3')

const port = 8080;

db.serialize(() => {
	db.run("CREATE TABLE IF NOT EXISTS users (user varchar(255) PRIMARY KEY, password varchar(255))")
	const stmt = db.prepare("INSERT INTO users VALUES (?, ?)")
	for (let i = 0; i < 10; i++){
		stmt.run("Ipsum"+i, "password"+i)
	}
	stmt.finalize()
})

app.post("/login", (req, res) => {
	re = req.body
    const us = re.user
	const pass = re.pwd
	db.get("SELECT * FROM users WHERE user = ? AND password = ?", [us, pass], (err, row) => {
		if (err){
			res.json({error: err.message})
		} else {
			if (row !== undefined){
				res.json({ok: true})		
			} else {
				res.send(401, {ok: false})
			}	
		}
	})
})

app.listen(port, () => console.log(`App listening to port ${port}`));