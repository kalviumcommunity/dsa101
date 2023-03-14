import React, { useEffect } from "react";
import "./Content.css";

export default function Content(props) {
  const { data, title, setChapterIndex, chapterId } = props;
  useEffect(() => {
    const headings = document.querySelectorAll(".learning-content h1");
    let chapters = [];

    headings.forEach((e) => {
      chapters.push(e.innerText);
      setChapterIndex(chapters);
      e.setAttribute("id", e.innerText.split(" ").join(""));
    });

    if (headings.length < 1) setChapterIndex([]);

    const codingQuestions = document.querySelectorAll("blockquote a");
    codingQuestions.forEach((e) => {
      e.parentElement.onclick = () => {
        window.open(e.getAttribute("href"), "_blank");
      };

      e.parentElement.innerHTML += `<img
      src="/assets/icons/arrow-right.svg"
      alt=""
      class="question-arrow"
    />`;
    });
  }, [setChapterIndex, data]);

  return (
    <>
      <h1 className="chapter-title" autoFocus>
        {`#${chapterId}. ${title}`}
      </h1>
      <div className="index-divider"></div>
      <div
        className="learning-content"
        dangerouslySetInnerHTML={{ __html: data }}
      ></div>
    </>
  );
}
