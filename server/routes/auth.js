const express = require("express");
const router = express.Router();

const Course = require("../model/courseSchema");
const User = require("../model/userSchema");
const Topics = require("../model/topicSchema");

router.get("/", (req, res) => {
  res.send("DSA101 Home");
});

router.get("/get-course", async (req, res) => {
  try {
    const courseData = await Course.find({});
    res.json(courseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/get-user/:id", async (req, res) => {
  try {
    const userData = await User.find({ uid: req.params.id });
    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/categories/:id", async (req, res) => {
  try {
    const courseData = await Course.find({ category: req.params.id });
    res.json(courseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/topics/:id", async (req, res) => {
  try {
    const courseData = await Course.find({ topic: req.params.id }).sort({
      chapterId: 1,
    });
    res.json(courseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/chapters/:id", async (req, res) => {
  try {
    const courseData = await Course.findOne({ chapter: req.params.id });
    res.json(courseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/chapterId/:category/:id", async (req, res) => {
  const id = Number(req.params.id);
  const category = req.params.category;
  try {
    let prevChapter = "",
      nxtChapter = "";
    prevChapter = await Course.findOne({
      category: category,
      chapterId: id - 1,
    });
    nxtChapter = await Course.findOne({
      category: category,
      chapterId: id + 1,
    });
    const chapterNames = {
      prevChapter,
      nxtChapter,
    };
    res.json(chapterNames);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/get-topics", async (req, res) => {
  try {
    const data = await Topics.findOne({});
    res.json(data.topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/admin-upload", async (req, res) => {
  const {
    category,
    chapter,
    content,
    quiz,
    topic,
    chapterId,
    chapter_description,
  } = req.body;
  if (
    !(
      category &&
      topic &&
      chapter &&
      content &&
      quiz &&
      chapterId &&
      chapter_description
    )
  ) {
    return res
      .status(422)
      .json({ error: "Please fill all the required fields", status: 422 });
  }

  try {
    const data = new Course({
      category,
      chapter,
      content,
      topic,
      quiz,
      chapterId,
      chapter_description,
    });

    await data.save();

    res.status(201).json({ message: "Chapter added successfully." });
  } catch (err) {
    res.status(500).json({
      error: "An error occured, please try again later. \n Error:",
      status: 500,
      err,
    });
  }
});

router.post("/login", async (req, res) => {
  const { name, notes, uid, completed_chapters } = req.body;
  if (!(name || notes || uid || completed_chapters)) {
    return res.status(422).json({ error: "Incomplete information" });
  }
  try {
    const user = await User.findOne({
      uid: uid,
    });
    if (user) {
      return res.status(201).json({ message: "User already exists." });
    }
    const data = new User({ name, notes, uid, completed_chapters });
    await data.save();
  } catch (err) {
    res.status(500).json({
      error: "An error occured, please try again later. \n Error:",
      err,
    });
  }
});

router.put("/add-topic", async (req, res) => {
  const { newTopic } = req.body;
  if (newTopic === "") {
    return res.status(422).json({ error: "Incomplete information" });
  }
  try {
    const data = await Topics.findOne({});
    if (data.topics.includes(newTopic)) {
      return res
        .status(201)
        .json({ message: `Topic: ${newTopic} already exists.` });
    }
    data.topics.push(newTopic);
    data.topics.sort();
    await data.save();
    res
      .status(201)
      .json({ message: `Topic: ${newTopic} added saved successfully.` });
  } catch (err) {
    res.status(500).json({
      error: "An error occured, please try again later. \n Error:",
      err,
    });
  }
});

router.put("/save-notes", async (req, res) => {
  const { notes, uid } = req.body;
  try {
    const user = await User.findOne({ uid: uid });
    user.notes = notes;
    await user.save();
    res.status(201).json({ message: "Notes saved successfully." });
  } catch (err) {
    res.status(500).json({
      error: "An error occured, please try again later. \n Error:",
      err,
    });
  }
});

router.put("/update-chapter", async (req, res) => {
  const { completed_chapters, uid } = req.body;
  try {
    const user = await User.findOne({ uid: uid });
    user.completed_chapters = completed_chapters;
    await user.save();
    res.status(201).json({ message: "Chapter updated successfully." });
  } catch (err) {
    res.status(500).json({
      error: "An error occured, please try again later. \n Error:",
      err,
    });
  }
});

router.put("/update", async (req, res) => {
  const {
    id,
    category,
    chapter,
    content,
    quiz,
    topic,
    chapterId,
    chapter_description,
  } = req.body;
  try {
    const data = await Course.findById(id);
    data.category = category;
    data.chapter = chapter;
    data.content = content;
    data.quiz = quiz;
    data.topic = topic;
    data.chapterId = chapterId;
    data.chapter_description = chapter_description;
    data.save();
    res
      .status(201)
      .json({ message: "The chapter has been updated successfully." });
  } catch (err) {
    res.status(500).json({
      error: "An error occured, please try again later. \n Error:",
      status: 500,
      err,
    });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res
      .status(201)
      .json({ message: "The chapter has been deleted successfully." });
  } catch (err) {
    res.status(500).json({
      error: "An error occured, please try again later. \n",
      status: 500,
      err,
    });
  }
});

module.exports = router;
