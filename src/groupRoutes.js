const express = require("express");
const { mongoConn } = require("./lib/dbConn");
const router = express.Router();
const { requireAuth } = require("./middlewares/authController");
const Announcement = require("./models/Announcement");
const Group = require("./models/Group");
const Teacher = require("./models/Teacher");

router.use(requireAuth("Teacher"));

router.get("/", async (req, res) => {
  mongoConn()
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
    res.status(200).json({groups = groupObjects})
    return
  } catch(err) {
    console.log(err);
    res.status(500).json({ message: "Oops something went wrong" });
    return;
  }
});

router.get("/:gid", async (req, res) => {
  mongoConn()
  try {
      const gid = req.params.gid
      const group = await Group.findOne({group_id : gid})
      const announcementList = []
      for(const i of group.announcements){
          let announcement = await Announcement.findOne({_id : i})
          announcementList.push(announcement)
      }
      res.status(200).json({announcements : announcementList})
      return;
  } catch(err) {
      console.log(err)
      res.status(500).json({message : "Oops Something went wrong in the backend"})
      return
  }   
});

router.post("/new", (req, res) => {
  mongoConn()
  try {
    let groupData = req.body.data
    groupData.admin = res.locals.userId
    let newGroup = new Group(groupData)
    await newGroup.save()
    res.status(200).json({message : "Successfully created the group !!"})
  } catch(err) {
    console.log(err)
    res.status(500).json({message : "Oops something went wrong"})
  }
});

router.post("/:gid/new", (req, res) => {
  mongoConn();
  const data = req.body;
  const group_id = req.params.gid;
  try {
    const existingGroup = await Group.findOne({ _id: group_id });
    if (!existingGroup) {
      console.log("No existing class found");
      res.status(400).json({ message: "No class Id found" });
      return;
    }
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
  try{
  const teacher_id = res.locals.userId
  const group_id = req.params.gid
  let existingGroup = await Group.findOne({group_id : group_id})
  if(!existingGroup){
    res.status(400).json("Incorrect group ID")
    return
  }

  existingGroup.members.push(teacher_id)
  await existingGroup.save()
  
  res.status(200).json({message : "You are added !"})
  }catch(err){
    console.log(err)
    res.status(500).json({message : "Something went wrong"})
  }
});
