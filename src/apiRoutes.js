const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { createToken, decodeToken } = require("./lib/tokenFunctions");
const { mongoConn } = require("./lib/dbConn");
const { createPassword } = require("./lib/createPassword");
const { sendMail } = require("./lib/sendMail");
const Teacher = require("./models/Teacher");
const Student = require("./models/Student");
const User = require("./models/User");
const Class = require("./models/Class");
const Announcement = require("./models/Announcement");
const { requireAuth } = require("./middlewares/authController");

const maxAge = 12 * 60 * 60; // 1/2 day in seconds

router.post("/signup", async (req, res) => {
  const { official_name, username, password, email, school_id } = req.body;
  let hashed_pwd = await bcrypt.hash(password, 10);
  mongoConn();
  let teacher = await Teacher.findOne({ email: email });
  if (teacher) {
    res
      .status(400)
      .json({ message: "Someone with this mail is already registered" });
    return;
  } else {
    let new_teacher = new Teacher({
      username: username,
      password: hashed_pwd,
      official_name: official_name,
      email: email,
      school_id: school_id,
    });

    new_teacher.save((err, user) => {
      if (err) {
        res.status(500).json({
          message: "Something went wrong in the server",
        });
        console.log(`Err : ${err}`);
        return;
      }
      res.status(200).json({
        message: "User registered successfully",
        user_name: user.username,
        email: user.email,
      });
    });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  mongoConn();
  let user = await User.findOne({ username: username });
  if (!user) {
    res
      .status(401)
      .json({ message: "Your account was not found.. Please signup" });
    return;
  }

  bcrypt.compare(password, user.password, (err, data) => {
    if (err) {
      res.status(401).json({ message: "Incorrect password" });
      return;
    }
  });

  let token = createToken(user._id, user._type, user.class);
  res.cookie("token", token, { httpOnly: true, maxAge: maxAge * 1000 }).json({
    message: "login success",
    name: user.official_name,
    role: user._type,
  });
  return;
});

router.get("/class", requireAuth(), async (req, res) => {
  let classId = res.locals.classId;
  mongoConn();
  try {
    const classDetails = await Class.findOne({ _id: classId });
    if (!classDetails) {
      console.log("Something went wrong while finding classes");
      res.status(300).json({ message: "No class found" });
      return;
    }
    res.status(200).json({ class: classDetails.class_name, class_id: classId });
  } catch (err) {
    console.log(`Err ${err}`);
  }
});

router.post("/class", requireAuth("Teacher"), (req, res) => {
  const token = req.cookies.token;
  const teacher_id = decodeToken(token, "id");
  const data = req.body;
  mongoConn();

  let newClass = new Class({
    grade: data.grade,
    section: data.section,
    class_name: data.class_name,
    students: [],
    announcements: [],
    teacher: teacher_id,
  });
  newClass.save((err, class_details) => {
    if (err) {
      res.status(500).json({
        message: "Something went wrong in the server",
      });
      console.log(`Err : ${err}`);
      return;
    }

    Teacher.findById(teacher_id, (err, doc) => {
      if (err) {
        res.status(500).json({
          message: "Something went wrong in the server",
        });
        console.log(`Err : ${err}`);
        return;
      }
      doc.class = class_details._id;
      doc.save();
      res.status(200).json({
        message: "Class registered successfully",
        class_name: class_details.class_name,
        class_id: class_details._id,
      });
    });
  });
});

router.post("/students", requireAuth("Teacher"), async (req, res) => {
  const student_details = req.body.students;
  const { classId } = res.locals;
  let addFailures = [];
  let addMailFailures = [];
  let alreadyAdded = [];
  mongoConn();
  for (i = 0; i <= student_details.length - 1; i++) {
    let student = student_details[i];
    const existingStudent = await Student.findOne({
      username: student.username,
      school_id: student.school_id,
    });
    if (existingStudent) {
      alreadyAdded.push(student.name);
      console.log("Already in db");
      continue;
    }
    const password = student.school_id;
    student.password = await bcrypt.hash(password, 10);
    student.class = classId;
    const newStudent = new Student(student);
    newStudent.save((err, stud) => {
      if (err) {
        addFailures.push(student.name);
        console.log(err);
        return;
      }
    });

    const mailSuccess = await sendMail();
    if (!mailSuccess) {
      addMailFailures.push(student);
    }
  }

  if (addFailures.length + alreadyAdded.length == student_details.length) {
    res.status(200).json({
      message: "No students were added",
      failed: addFailures,
      existing: alreadyAdded,
      failedMails: addMailFailures,
    });
    return;
  }
  res.status(200).json({
    message: "Added students",
    failed: addFailures,
    existing: alreadyAdded,
    failedMails: addMailFailures,
  });
});

module.exports = router;
