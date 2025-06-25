const express = require("express");
const cors = require("cors");
const mysql2 = require("mysql2");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ MySQL Connection (FreeSQLDatabase)
const con = mysql2.createConnection({
  host: "sql12.freesqldatabase.com",
  user: "sql12786813",
  password: "fqmaGH92ij",
  database: "sql12786813"
});

// ✅ Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // directory name
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique name
  }
});

const upload = multer({ storage });

// ✅ Serve static files from uploads/
app.use('/uploads', express.static('uploads'));

// ✅ Insert student with file
app.post("/ss", upload.single("file"), (req, res) => {
  let sql = "INSERT INTO student VALUES (?, ?, ?, ?)";
  let data = [req.body.rno, req.body.name, req.body.marks, req.file.filename];

  con.query(sql, data, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
});

// ✅ Get all students
app.get("/gs", (req, res) => {
  let sql = "SELECT * FROM student";
  con.query(sql, (err, result) => {
    if (err) res.status(500).json({ error: err });
    else res.json(result);
  });
});

// ✅ Delete student and image
app.delete("/ds", (req, res) => {
  let data = [req.body.rno];

  // Try to delete the image from uploads
  fs.unlink("./uploads/" + req.body.image, () => {});

  let sql = "DELETE FROM student WHERE rno = ?";
  con.query(sql, data, (err, result) => {
    if (err) res.status(500).send(err);
    else res.send(result);
  });
});

// ✅ Use dynamic port for Render
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log("Server ready at port " + PORT);
});
