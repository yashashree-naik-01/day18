const express = require("express");
const cors = require("cors");
const mysql2 = require("mysql2");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const con = mysql2.createConnection({
  host: "sql12.freesqldatabase.com",
  user: "sql12786813",
  password: "fqmaGH92ij",
  database: "sql12786813"
});

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
app.use('/uploads', express.static('uploads'));

// Insert route
app.post("/ss", upload.single("file"), (req, res) => {
  let sql = "insert into student values(?, ?, ?, ?)";
  let data = [req.body.rno, req.body.name, req.body.marks, req.file.filename];
  
  con.query(sql, data, (err, result) => {
    if (err)
      res.send(err);
    else
      res.send(result);
  });
});

app.get("/gs", (req, res) => {
  let sql = "SELECT * FROM student";
  con.query(sql, (err, result) => {
    if (err) res.status(500).json({ error: err });
    else res.json(result); // ✅ Use json
  });
});


// Delete a student
app.delete("/ds", (req, res) => {
  let data = [req.body.rno];
  fs.unlink("./uploads/" + req.body.image, () => {});
  let sql = "delete from student where rno = ?";
  con.query(sql, data, (err, result) => {
    if (err) res.send(err);
    else res.send(result);
  });
});

app.listen(9000, () => {
  console.log("ready @ 9000");
});
