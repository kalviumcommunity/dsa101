import React, { useState, useRef } from "react";
import JoditEditor from "jodit-react";
import "./CourseUpload.css";
import FormQuiz from "./FormQuiz/FormQuiz";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import GetCourse from "../../../data/GetCourse";
import GetTopics from "../../../data/GetTopics";

export default function CourseUpdate() {
  const [isSaved, setIsSaved] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  const topics = GetTopics();

  const oldData = GetCourse(`/chapters/${params.id}`);
  const editor = useRef(null);
  const [formData, setFormData] = useState();
  if (oldData && !formData) setFormData(oldData);

  const updateChapter = async (e) => {
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
    try {
      const res = await fetch(process.env.REACT_APP_SERVER_URL + "/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: formData._id,
          category,
          chapter,
          content,
          quiz,
          topic,
          chapterId,
          chapter_description,
        }),
      });
      const data = await res.json();
      navigate(`/learning/${chapter}`);
      if (data.status === 422 || data.status === 500) {
        alert(data.error);
        return data.error;
      } else {
        alert(data.message);
        setIsSaved(true);
      }
    } catch (err) {
      console.log("An error occured: " + err);
    }
  };

  function onChangeHandler(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

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
    <div className="course-upload-container">
      <h1 className="heading">UPDATE the course</h1>
      {formData && topics && (
        <form method="PUT" onSubmit={updateChapter} className="course-form">
          <div className="form-item-wrapper">
            <div className="form-item">
              <label htmlFor="course-category">Category</label>
              <select
                name="category"
                id="course-category"
                onChange={onChangeHandler}
                defaultValue={formData.category}
              >
                <option value={"Basics"}>Basics</option>
                <option value={"DSA Starter"}>DSA Starter</option>
                <option value={"Adv. DSA"}>Adv. DSA</option>
              </select>
            </div>
            <div className="form-item">
              <label htmlFor="course-topic">Topic</label>
              <select
                name="topic"
                id="course-topic"
                onChange={onChangeHandler}
                defaultValue={formData.topic}
              >
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
                value={formData.chapterId}
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
                value={formData.chapter}
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
              value={formData.chapter_description}
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

          <button className="btn btn-primary course-submit-btn" type="submit">
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
