const express = require("express");
const { nanoid } = require("nanoid");
const { mongoConn } = require("./lib/dbConn");
const router = express.Router();
const { requireAuth } = require("./middlewares/authController");
const Announcement = require("./models/Announcement");
const Group = require("./models/Group");
const Teacher = require("./models/Teacher");

router.use(requireAuth("Teacher"));

router.get("/", async (req, res) => {
  mongoConn();
  try {
    const teacher_id = res.locals.userId;
    const TeacherObj = await Teacher.findOne({ _id: teacher_id });
    if (!TeacherObj) {
      res.status(400).json({ message: "You are not a teacher" });
      return;
    }
    const groups = TeacherObj.groups;
    const groupObjects = [];
    for (const i of groups) {
      let group = await Group.findOne({ _id: i });
      groupObjects.push(group);
    }
    res.status(200).json({ groups: groupObjects });
    return;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Oops something went wrong" });
    return;
  }
});

router.get("/:gid", async (req, res) => {
  mongoConn();
  try {
    const gid = req.params.gid;
    const group = await Group.findOne({ group_id: gid });
    const announcementList = [];
    for (const i of group.announcements) {
      let announcement = await Announcement.findOne({ _id: i });
      announcementList.push(announcement);
    }
    res
      .status(200)
      .json({ announcements: announcementList, group_name: group.name });
    return;
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Oops Something went wrong in the backend" });
    return;
  }
});

router.post("/new", async (req, res) => {
  mongoConn();
  try {
    let groupData = req.body;
    let teacher_id = res.locals.userId;
    groupData.admin = teacher_id;
    groupData.group_id = nanoid(8);
    let newGroup = new Group(groupData);
    const GroupObj = await newGroup.save();
    let existingFaculty = await Teacher.findOne({ _id: teacher_id });
    existingFaculty.groups.push(GroupObj._id);
    await existingFaculty.save();
    res.status(200).json({ message: "Successfully created the group !!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Oops something went wrong" });
  }
});

router.post("/:gid/new", async (req, res) => {
  mongoConn();
  const data = req.body;
  const group_id = req.params.gid;
  try {
    const existingGroup = await Group.findOne({ group_id: group_id });
    if (!existingGroup) {
      console.log("No existing class found");
      res.status(400).json({ message: "No class Id found" });
      return;
    }
    data.uid = nanoid(8);
    const newAnn = new Announcement(data);
    const AnnData = await newAnn.save();
    existingGroup.announcements.push(AnnData._id);
    await existingGroup.save();
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

router.post("/:gid/add", async (req, res) => {
  mongoConn();
  try {
    const teacher_id = res.locals.userId;
    const group_id = req.params.gid;
    let existingTeacher = await Teacher.findOne({ _id: teacher_id });
    let existingGroup = await Group.findOne({ group_id: group_id });
    if (!existingGroup) {
      res.status(400).json("Incorrect group ID");
      return;
    }
    existingTeacher.groups.push(existingGroup._id);
    existingGroup.members.push(teacher_id);
    await existingTeacher.save();
    await existingGroup.save();

    res.status(200).json({ message: "You are added !" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
