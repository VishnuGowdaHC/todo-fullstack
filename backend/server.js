import express from 'express'
import cors from 'cors'
import mysql from 'mysql2'

const app = express()

app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "mydb",
  port: 3306
})

db.connect((err) => {
  if(err) {
    console.error("❌ MySQL Connection Failed: ", err);
    return;
  }
  console.log("Connected to db")
})

app.get('/',  (req, res) => {
  
      db.query("SELECT * FROM tasks", (err, results) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json(results)
    })
})

app.post('/',  (req, res) => {
  const {task, isComplete} = req.body
  db.query("INSERT INTO tasks (title, isComplete) VALUES (?, ?)", [task, isComplete])
})

app.put('/', (req,res) => {
  const { id, isComplete } = req.body
  if (id === undefined) return console.error("error code 404 missing id or check")
  db.query("UPDATE tasks SET iscomplete = ? WHERE id = ?", [isComplete, id])
  console.log(isComplete )
})

app.listen(3000, () => {
  console.log("Server is runing at port 3000")
})