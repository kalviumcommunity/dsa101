import React, { useState, useRef } from "react";
import JoditEditor from "jodit-react";
import "./CourseUpload.css";
import FormQuiz from "./FormQuiz/FormQuiz";
import GetTopics from "../../../data/GetTopics";
import { useNavigate } from "react-router";

export default function CourseUpload() {
  const [isSaved, setIsSaved] = useState(false);
  const editor = useRef(null);
  const topics = GetTopics();
  const navigate = useNavigate();

  const initialValues = {
    category: "Basics",
    topic: "Basics of C++",
    chapter: "",
    chapter_description: "",
    content: "",
    quiz: [
      { question: "", options: ["", "", "", ""], correct: "" },
      { question: "", options: ["", "", "", ""], correct: "" },
      { question: "", options: ["", "", "", ""], correct: "" },
      { question: "", options: ["", "", "", ""], correct: "" },
      { question: "", options: ["", "", "", ""], correct: "" },
    ],
    chapterId: -1,
  };
  const [formData, setFormData] = useState(initialValues);

  function onChangeHandler(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      category,
      chapter,
      content,
      quiz,
      topic,
      chapterId,
      chapter_description,
    } = formData;
    const res = await fetch(
      process.env.REACT_APP_SERVER_URL + "/admin-upload",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          chapter,
          content,
          quiz,
          topic,
          chapterId,
          chapter_description,
        }),
      }
    );
    const data = await res.json();
    if (data.status === 422 || data.status === 500) {
      alert(data.error);
    } else {
      alert("Chapter added scuccessfully!");
      setIsSaved(true);
      navigate(`/admin-update/${formData.chapter}`);
    }
  };

  window.onbeforeunload = (e) => {
    if (!isSaved) {
      e.preventDefault();
      return "";
    }
  };

  window.close = (e) => {
    if (!isSaved) {
      e.preventDefault();
      return "";
    }
  };

  return (
    topics && (
      <div className="course-upload-container">
        <h1 className="heading">Upload the course</h1>
        <form method="POST" onSubmit={handleSubmit} className="course-form">
          <div className="form-item-wrapper">
            <div className="form-item">
              <label htmlFor="course-category">Category</label>
              <select
                name="category"
                id="course-category"
                onChange={onChangeHandler}
              >
                <option value={"Basics"}>Basics</option>
                <option value={"DSA Starter"}>DSA Starter</option>
                <option value={"Adv. DSA"}>Adv. DSA</option>
              </select>
            </div>
            <div className="form-item">
              <label htmlFor="course-topic">Topic</label>
              <select name="topic" id="course-topic" onChange={onChangeHandler}>
                {topics.map((e, i) => {
                  return (
                    <option key={i} value={e}>
                      {e}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="form-item-wrapper chapter">
            <div className="form-item">
              <label htmlFor="course-chapter">ID</label>
              <input
                type="number"
                name="chapterId"
                placeholder="Chapter ID"
                onChange={onChangeHandler}
                id="course-chapterId"
              />
            </div>
            <div className="form-item">
              <label htmlFor="course-chapter">Chapter</label>
              <input
                type="text"
                name="chapter"
                placeholder="Chapter"
                onChange={onChangeHandler}
                id="course-chapter"
              />
            </div>
          </div>
          <div className="form-item">
            <label htmlFor="course-chapter">Description</label>
            <input
              type="text"
              name="chapter_description"
              placeholder="Description"
              onChange={onChangeHandler}
              id="course-chapter-description"
            />
          </div>
          <div className="form-item">
            <label>Content</label>
            <div className="editor-container">
              <JoditEditor
                ref={editor}
                value={formData.content}
                onChange={(newContent) => {
                  setFormData({ ...formData, content: newContent });
                }}
              />
            </div>
          </div>
          <div className="form-item course-quiz-container">
            <h2 className="quiz-title">Quiz</h2>
            <FormQuiz
              formData={formData}
              setFormData={setFormData}
              id={1}
              quiz={formData.quiz}
            />
            <FormQuiz
              formData={formData}
              setFormData={setFormData}
              id={2}
              quiz={formData.quiz}
            />
            <FormQuiz
              formData={formData}
              setFormData={setFormData}
              id={3}
              quiz={formData.quiz}
            />
            <FormQuiz
              formData={formData}
              setFormData={setFormData}
              id={4}
              quiz={formData.quiz}
            />
            <FormQuiz
              formData={formData}
              setFormData={setFormData}
              id={5}
              quiz={formData.quiz}
            />
          </div>

          <button
            className="btn btn-primary course-submit-btn"
            type="submit"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </form>
      </div>
    )
  );
}
