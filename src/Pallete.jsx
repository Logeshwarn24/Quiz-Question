
import React from "react";

const StatusButton = ({ answerStatus }) => {
  let backgroundColor;
  let comment;

  switch (answerStatus) {
    case 'answered':
      backgroundColor = "green"; 
      comment = "You Answered the Question!";
      break;
    case 'viewed':
      backgroundColor = "blue";
      comment = "You view the Question but not Answered!"; 
      break;
    case 'not_viewed':
      backgroundColor = "red";
      comment = "You not view the Question!";
      break;
    default:
      backgroundColor = "brown"; 
      comment = "";
  }

  return (
    <div
      style={{
        backgroundColor: backgroundColor,
        height: "80px",
        width: "100px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white", 
        fontWeight: "bold",
        padding: "10px",
        margin: "20px",
        borderRadius: "10px",
      }}
    >{comment}</div>
  );
};

const Pallet = ({ questionStatus }) => {
  return (
    <div style={{ display: "flex", gap: "10px" }}>
      {questionStatus.map((status, index) => (
        <StatusButton key={index} answerStatus={status} />
      ))}
    </div>
  );
};

export default Pallet;
