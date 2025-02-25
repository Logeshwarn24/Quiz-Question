import { useState, useEffect } from "react";

export default function Question({ questionStatement, options, questionNumber, onAnswer, correctOption, isAnswered }) {
  const [selectedOption, setSelectedOption] = useState("");  // Track selected option
  const [answered, setAnswered] = useState(false);  // Track if the question has been answered
  const [feedback, setFeedback] = useState("");  // Track feedback for the user

  // Handle the option change
  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    setAnswered(true);  // Mark the question as answered
    setFeedback(value === correctOption ? "Correct! Well done." : "Incorrect! Try again.");
    onAnswer(value);  // Send the answer to the parent (QuizeQuestion) component
  };

  useEffect(() => {
    // Reset feedback and selected option if the question is revisited
    if (isAnswered && !answered) {
      setFeedback(""); 
      setSelectedOption(""); // Reset only if question is revisited and not yet answered
    }
  }, [isAnswered, answered]);

  return (
    <div className="question-container">
      <h2>{questionNumber}. {questionStatement}</h2>

      {/* Render options */}
      {options.map((option, index) => (
        <div key={index}>
          <label>
            <input
              type="radio"
              value={option}
              checked={selectedOption === option}
              onChange={handleChange}
              disabled={isAnswered}  // Disable options after answering
            />
            {option}
          </label>
        </div>
      ))}

      {/* Feedback after answering */}
      {answered && (
        <div className="feedback">
          <p style={{ color: selectedOption === correctOption ? "green" : "red" }}>
            {feedback}
          </p>
        </div>
      )}
    </div>
  );
}
