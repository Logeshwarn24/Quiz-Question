import { useEffect, useState } from "react";
import Question from "./QuestionComponent";
import Pallete from "../Pallete";
import "./quiz.css";
import Timer from "./Timer";
const url = "https://opentdb.com/api.php?amount=5&type=multiple";

const QuizeQuestion = () => {
  const [currQuestionIndex, setCurrQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [questionStatus, setQuestionStatus] = useState([]);
  const [time, setTime] = useState(30); // Timer set to 30 seconds
  const [overAllTime, setOverAllTime] = useState(0);
  const [passClicked, setPassClicked] = useState(false);
  const [fiftyFiftyUsed, setFiftyFiftyUsed] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false); // New state for quiz start

  // Move to next question and reset timer
  const handleNextClick = () => {
    if (currQuestionIndex < questions.length - 1) {
      setCurrQuestionIndex(currQuestionIndex + 1);
      if (questionStatus[currQuestionIndex] !== "answered") {
        updateQuestionStatus("viewed");
      }
      setTime(30); // Reset the timer when moving to the next question
    } else {
      setQuizFinished(true); // Quiz finished
    }
  };

  // Move to previous question
  const handlePreviousClick = () => {
    if (currQuestionIndex > 0) {
      setCurrQuestionIndex(currQuestionIndex - 1);
      if (questionStatus[currQuestionIndex] !== "answered") {
        updateQuestionStatus("viewed");
      }
    }
  };

  // Handle pass click and reset timer
  const handlePassClick = () => {
    if (currQuestionIndex < questions.length - 1) {
      let randomIndex = currQuestionIndex;
      while (randomIndex === currQuestionIndex) {
        randomIndex = Math.floor(Math.random() * questions.length);
      }

      setPassClicked(true);
      setTime(30); // Reset the timer when passing the question

      setQuestions((prevQuestions) => {
        const newQuestions = [...prevQuestions];
        newQuestions[currQuestionIndex] = {
          ...newQuestions[currQuestionIndex],
          question: questions[randomIndex].question,
          incorrect_answers: questions[randomIndex].incorrect_answers,
          correct_answer: questions[randomIndex].correct_answer,
        };
        return newQuestions;
      });
    }
  };

  // Handle answer selection
  const handleAnswer = (selectedAnswer) => {
    if (selectedAnswer === questions[currQuestionIndex].correct_answer) {
      setScore((prevScore) => prevScore + 1);
    }
    updateQuestionStatus("answered");
  };

  // Update the question status (viewed/answered)
  const updateQuestionStatus = (status) => {
    setQuestionStatus((prevStatus) => {
      const newStatus = [...prevStatus];
      newStatus[currQuestionIndex] = status;
      return newStatus;
    });
  };

  // Fetch quiz questions
  useEffect(() => {
    const fetchingData = async () => {
      try {
        const fetchUrl = await fetch(url);
        const data = await fetchUrl.json();
        if (data && data.results) {
          setQuestions(data.results);
          setQuestionStatus(new Array(data.results.length).fill("not_viewed"));
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
        setLoading(false);
      }
    };
    fetchingData();
  }, [overAllTime]);

  // Automatically move to the next question when timer reaches 0
  useEffect(() => {
    if (time === 0) {
      handleNextClick(); // Move to next question when time runs out
      setTime(30); // Reset timer to 30 seconds after moving to the next question
    }
  }, [time]);

  // Handle 50-50 life line
  const handleFiftyFiftyClick = () => {
    if (!fiftyFiftyUsed) {
      setFiftyFiftyUsed(true);

      const incorrectOptions = [...questions[currQuestionIndex].incorrect_answers];
      const correctAnswer = questions[currQuestionIndex].correct_answer;

      const randomIndexes = [];
      while (randomIndexes.length < 2) {
        const randomIndex = Math.floor(Math.random() * incorrectOptions.length);
        if (!randomIndexes.includes(randomIndex)) {
          randomIndexes.push(randomIndex);
        }
      }

      randomIndexes.forEach((index) => {
        incorrectOptions.splice(index, 1);
      });

      const finalOptions = [correctAnswer, ...incorrectOptions];

      setQuestions((prevQuestions) => {
        const newQuestions = [...prevQuestions];
        newQuestions[currQuestionIndex] = {
          ...newQuestions[currQuestionIndex],
          options: finalOptions.sort(() => Math.random() - 0.5),
        };
        return newQuestions;
      });
    }
  };

  // Handle restart quiz
  const handleRestart = () => {
    setCurrQuestionIndex(0);
    setScore(0);
    setQuizFinished(false);
    setQuizStarted(true); // Set quizStarted to true when restarting
    setQuestionStatus(new Array(questions.length).fill("not_viewed"));
    setTime(30); // Reset the timer
    setPassClicked(false);
    setFiftyFiftyUsed(false);
  };

  if (loading) return <p>loading.......</p>;

  if (!questions || questions.length === 0) return <p>No questions available...</p>;

  return (
    <div className="quiz">
      <h1>Quiz App</h1>
      <Timer time={time} setTime={setTime} quizFinished={quizFinished}/>
      <h2>Question Attempted: {currQuestionIndex + 1}/5</h2>

      {quizFinished ? (
        <div className="result">
          <h2>Your Score: {score}/{questions.length}</h2>
          <h3>{score / questions.length >= 0.5 ? "You Passed!" : "You Failed!"}</h3>
          {/* Restart button */}
          <button onClick={handleRestart}>Restart Quiz</button>
        </div>
      ) : (
        <>
          <Question
            questionStatement={questions[currQuestionIndex].question}
            options={[...questions[currQuestionIndex].incorrect_answers, questions[currQuestionIndex].correct_answer]}
            correctOption={questions[currQuestionIndex].correct_answer}
            questionNumber={currQuestionIndex + 1}
            onAnswer={handleAnswer} // pass the handleAnswer function to the Question component
          />
          <button onClick={handlePreviousClick}>Previous</button>
          <button onClick={handleNextClick}>Next</button>
          <Pallete questionStatus={questionStatus} />
          <div className="lifelines">
            <h3>LifeLines</h3>
            <button
              className={`lifeline-btn ${fiftyFiftyUsed ? 'disabled' : ''}`}
              onClick={handleFiftyFiftyClick}
              disabled={fiftyFiftyUsed}
            >
              50-50 Life Line
            </button>

            <button
              className={`lifeline-btn ${passClicked ? 'disabled' : ''}`}
              onClick={handlePassClick}
              disabled={passClicked}
            >
              Pass Question
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default QuizeQuestion;
