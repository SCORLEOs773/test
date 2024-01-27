const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(
  "mongodb+srv://SCORLEOs773:chiOxBZBTHpJoV96@cluster0.ghdrk.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Define your MongoDB schema and model
const studentSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  sem1Marks: {
    type: Number,
    default: 0,
  },
  sem2Marks: {
    type: Number,
    default: 0,
  },
  cgpa: {
    type: Number,
    default: 0,
  },
  // Add other fields as needed...
});

const Student = mongoose.model("Student", studentSchema);

// Define your routes (GET, POST, PUT, PATCH, DELETE)

// GET all students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create a new student
app.post("/students", async (req, res) => {
  const student = new Student({
    name: req.body.name,
    sem1Marks: req.body.sem1Marks,
    sem2Marks: req.body.sem2Marks,
    cgpa: req.body.cgpa,
    // other fields...
  });

  try {
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update a student
app.put("/students/:uid", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.uid,
      {
        name: req.body.name,
        sem1Marks: req.body.sem1Marks,
        sem2Marks: req.body.sem2Marks,
        cgpa: req.body.cgpa,
        // other fields...
      },
      { new: true }
    );
    if (student == null) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH update a student
app.patch("/students/:uid", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.uid,
      { $set: req.body },
      { new: true }
    );
    if (student == null) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a student
app.delete("/students/dl/:uid", async (req, res) => {
  try {
    const student = await Student.findByIdAndRemove(req.params.uid);
    if (student == null) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json({ message: "Student deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
