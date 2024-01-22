var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
mongoose.connect("mongodb://localhost:27017/attendance");
var userSchema = mongoose.Schema({
  universityName: String,
  college: String,
  department: String,
  programme: String,
  specialization: String,
  scheme: String,
  semester: String,
  facultyName: String,
  email: String,
  password: String,
});
var studentSchema = mongoose.Schema({
  facultyName:String,
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
router.get("/home", async (req, res) => {
  const userEmailFromQuery = req.query.email;
  console.log(userEmailFromQuery)
  var user = await UserModal.findOne({ email: userEmailFromQuery });
  // Set user details in local storage
  res.render("Home", { user: user });
  
});

router.post("/login", async (req, res) => {
  console.log(req.body);
  var user = await UserModal.findOne({ email: req.body.email });

  if (user) {
    bcrypt.compare(req.body.password, user.password).then((response) => {
      if (response) {
       email=user.email
       res.redirect(`/home?email=${user.email}`);
      } else {
        res.render("LoginPage", { status: "Password is Wrong" });
      }
    });
  } else {
    res.render("LoginPage", { status: "UserName is Wrong" });
  }
});

router.get("/student", async (req, res) => {
  const facultyName = req.query.facultyName;
  console.log(facultyName)
  res.render("AddStudents",{facultyName});
});
router.post("/student", async (req, res) => {
  var student = new StudentModel({
    facultyName:req.body.facultyName,
    registerNumber: req.body.registerNumber,
    rollNumber: req.body.rollNumber,
    studentName: req.body.studentName,
  });
  console.log(req.body)
  student.save();
  res.redirect("/attendance");
});

router.get("/attendance", async (req, res) => {
  var students = await StudentModel.find({});
  res.render("Attendence", { students });
});

router.post("/create-user", async (req, res) => {
  try {
    console.log(req.body)
    var password = await bcrypt.hash(req.body.password, 10);
    var user = new UserModal({
      universityName: req.body.universityName,
      college: req.body.college,
      department: req.body.department,
      programme: req.body.programme,
      specialization: req.body.specialization,
      scheme: req.body.scheme,
      semester: req.body.semester,
      facultyName: req.body.facultyName,
      email: req.body.email,
      password: password,
    });

    // Save the user and wait for the operation to complete
    await user.save();

    // Redirect after the user is successfully saved
    res.redirect("/");
  } catch (error) {
    // Handle any errors that might occur during the process
    console.error("Error creating user:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
