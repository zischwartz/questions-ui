import React, { useState, useEffect } from "react";

const initial_questions = [
  "What is your name?",
  "What is your quest?",
  "What is your favorite color?",
  "What is your favorite book?",
];

export default function App() {
  const [questions, setQuestions] = useState(initial_questions);
  const [erroredText, setErroredText] = useState("");
  const reorder = (drag_index, drop_index) => {
    setQuestions(reorder_array(questions, drag_index, drop_index));
  };
  // only relevant while we lack ids
  const doesContainDupe = questions.length !== new Set(questions).size;
  return (
    <div>
      <h2>Questions</h2>
      <p>Drag questions to reorder them, or edit the json below!</p>
      <div>
        {questions.map((item, index) => (
          <ListItem key={item} item={item} index={index} reorder={reorder} />
        ))}
      </div>
      <textarea
        id="json"
        className={erroredText ? "error" : ""}
        value={erroredText || JSON.stringify(questions)}
        onChange={(e) => {
          try {
            setQuestions(JSON.parse(event.target.value));
            setErroredText("");
          } catch (e) {
            setErroredText(event.target.value);
          }
        }}
      />
      <div id="message_box">
        {erroredText
          ? "⚠️ Sorry, there was a problem with the JSON entered. Please fix it."
          : ""}
        {doesContainDupe
          ? "⚠️ Sorry, there was a duplicate question in the JSON entered. Please fix it."
          : ""}
      </div>
    </div>
  );
}

function ListItem(props) {
  const [isOver, setIsOver] = useState(false);
  const { item, index, reorder } = props;
  const onDragStart = (e) => {
    // console.log("drag start");
    // e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index);
  };

  const onDragEnter = (e) => {
    setIsOver(true);
  };
  const onDragLeave = (e) => {
    setIsOver(false);
  };

  const onDragOver = (e) => {
    // XXX this allows the below onDrop event
    e.preventDefault();
  };
  const onDrop = (e) => {
    const drag_index = parseInt(e.dataTransfer.getData("text"));
    setIsOver(false);
    reorder(drag_index, index);
  };

  return (
    <div
      draggable={true}
      onDragStart={onDragStart}
      className={`ListItem ${isOver ? "isOver" : ""}`}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {item}
    </div>
  );
}

// I started to do this myself with the spread operator and then found it here: https://stackoverflow.com/a/61613914/83859
const reorder_array = (array, sourceIndex, destinationIndex) => {
  const smallerIndex = Math.min(sourceIndex, destinationIndex);
  const largerIndex = Math.max(sourceIndex, destinationIndex);

  return [
    ...array.slice(0, smallerIndex),
    ...(sourceIndex < destinationIndex
      ? array.slice(smallerIndex + 1, largerIndex + 1)
      : []),
    array[sourceIndex],
    ...(sourceIndex > destinationIndex
      ? array.slice(smallerIndex, largerIndex)
      : []),
    ...array.slice(largerIndex + 1),
  ];
};
