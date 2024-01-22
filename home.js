var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
mongoose.connect("mongodb://localhost:27017/sample4");
var userSchema = mongoose.Schema({
  universityName: String,
  college: String,
  department: String,
  course: String,
  Specialization: String,
  scheme: String,
  semester: String,
  facultyName: String,
  email: String,
  password: String,
});
var studentSchema = mongoose.Schema({
  registerNumber: String,
  rollNumber: String,
  studentName: String,
});
var UserModal = mongoose.model("user", userSchema);
var StudentModel = mongoose.model("students", studentSchema);

router.get("/", (req, res) => {
  res.render("LoginPage", { status: "ok" });
});
router.get("/signup", (req, res) => {
  res.render("Registration");
});
router.get("/home", (req, res) => {
  res.render("Home");
});

router.post("/login", async (req, res) => {
  console.log(req.body);
  var user = await UserModal.findOne({ email: req.body.email });

  if (user) {
    bcrypt.compare(req.body.password, user.password).then((response) => {
      if (response) {
        res.render("Home", { user });
      } else {
        res.render("LoginPage", { status: "Password is Wrong" });
      }
    });
  } else {
    res.render("LoginPage", { status: "UserName is Wrong" });
  }
});
router.post("/register", async (req, res) => {
  var password = await bcrypt.hash(req.body.password, 10);
  var user = new UserModal({
    universityName: req.body.universityName,
    college: req.body.college,
    department: req.body.department,
    course: req.body.course,
    Specialization: req.body.Specialization,
    scheme: req.body.scheme,
    semester: req.body.semester,
    facultyName: req.body.facultyName,
    email: req.body.email,
    password: password,
  });
  user.save();
  res.redirect("/");
});

router.get("/student", async (req, res) => {
  res.render("AddStudents");
});
router.post("/student", async (req, res) => {
  var student = new StudentModel({
    registerNumber: req.body.registerNumber,
    rollNumber: req.body.rollNumber,
    studentName: req.body.studentName,
  });
  student.save();
  res.redirect("/");
});

module.exports = router;
