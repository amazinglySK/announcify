const fs = require("fs");
const express = require("express");
const router = express.Router();
const { requireAuth } = require("./middlewares/authController");
const Announcement = require("./models/Announcement");
const Class = require("./models/Class");
const Student = require("./models/Student");
const { mongoConn } = require("./lib/dbConn");
const path = require("path");
const CsvParser = require("json2csv").Parser;

router.get("/", requireAuth(), async (req, res) => {
  mongoConn();
  const { classId, userId } = res.locals;
  try {
    const ExistingClass = await Class.findOne({ _id: classId });
    if (!ExistingClass) {
      res.status(400).json({
        message: "No class found",
      });
      return;
    }
    const { announcements } = ExistingClass;
    let announcementList = [];
    for (i = 0; i <= announcements.length - 1; i++) {
      if (announcementList.length == 10) {
        break;
      }
      let announcementObj = await Announcement.findOne({
        _id: announcements[i],
      });
      if (announcementObj.completed_students.includes(userId)) {
        continue;
      }
      const { title, description, dueDate, uid } = announcementObj;
      announcementList.push({ title, description, dueDate, uid });
    }
    res.status(200).json({ announcements: announcementList });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong",
      error: `Err : ${err}`,
    });
  }
});

router.get("/:uid", requireAuth(), async (req, res) => {
  mongoConn();
  const annId = req.params.uid;
  const announcement = await Announcement.findOne({ uid: annId });
  if (!announcement) {
    res.status(404).json({
      message: "No such announcement found",
    });
    return;
  }
  let links = announcement.links.map(
    (elt) =>
      `<a href = "${elt}" class = "link" target="_blank" rel="noopener noreferrer">${elt}</a>`
  );
  let linksString = links.join("\n");
  const post_title = announcement.title;
  const post_content = announcement.content;
  // const postDate = announcement.dateOfPost;
  let htmlData = fs.readFileSync(path.join(__dirname, "/app/ann.html"), "utf8");
  htmlData = htmlData.replace(/<Post_Title>/g, post_title);
  htmlData = htmlData.replace(/<Post_Content>/g, post_content);
  htmlData = htmlData.replace(/<Links>/g, linksString);
  let replaceValue =
    res.locals.role == "Student"
      ? " "
      : `<a href = "/ann/${annId}/report" class= "report_link">Report</a>`;
  htmlData = htmlData.replace(/<Report>/g, replaceValue);
  res.status(200).send(htmlData);
});

router.put("/:id/submit", requireAuth("Student"), async (req, res) => {
  mongoConn();
  try {
    const post_id = req.params.id;
    const { userId } = res.locals;
    const existingAnn = await Announcement.findOne({ uid: post_id });
    if (!existingAnn) {
      res.status(400).json({ message: "No class found" });
      return;
    }
    if (!existingAnn.completed_students.includes(userId)) {
      existingAnn.completed_students.push({
        student_id: userId,
        time: Date.now(),
      });
      await existingAnn.save();
      res.status(200).json({ message: "Submitted your response" });
      return;
    }
    res.status(200).json({ message: "Your response is already there" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong in the backend" });
  }
});

router.get("/:id/report", requireAuth("Teacher"), async (req, res) => {
  mongoConn();
  const post_id = req.params.id;
  try {
    const ann = await Announcement.findOne({ uid: post_id });
    if (!ann) {
      res.json(400).json({ message: "Incorrect postId" });
      return;
    }

    let ann_completions = [];
    for (const e of ann.completed_students) {
      let stud = await Student.findOne({ _id: e.student_id });
      let date = new Date(e.time);
      if (!stud) {
        throw "Student not found";
      }
      ann_completions.push({
        Name: stud.official_name,
        Time: date.toLocaleString("en-GB"),
      });
    }
    const csvFields = ["Name", "Time"];
    const parser = new CsvParser({ csvFields });
    const csvResponse = parser.parse(ann_completions);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Announcement-Report.csv"
    );
    res.status(200).end(csvResponse);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong in the backend" });
  }
});

router.post("/new", requireAuth("Teacher"), async (req, res) => {
  mongoConn();
  const data = req.body;
  const class_id = res.locals.classId;
  try {
    const existingClass = await Class.findOne({ _id: class_id });
    if (!existingClass) {
      console.log("No existing class found");
      res.status(400).json({ message: "No class Id found" });
      return;
    }
    const newAnn = new Announcement(data);
    const AnnData = await newAnn.save();
    existingClass.announcements.push(AnnData._id);
    await existingClass.save();
    console.log("All done.");
    res.status(200).json({
      message: "Announcement added successfully",
      post_id: AnnData.uid,
    });
  } catch (err) {
    console.log(`Err : ${err}`);
    res.status(500).json({
      message: "Something went wrong in the backend",
    });
  }
});

module.exports = router;
