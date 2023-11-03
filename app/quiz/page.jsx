"use client";
import React, { useState, useEffect } from "react";
import { quiz } from '../data.js';

const getRandomQuestions = () => {
  const shuffledQuestions = quiz.questions.sort(() => Math.random() - 0.5);
  return shuffledQuestions.slice(0,10);
};

const Page = () => {
  const [randomQuestions, setRandomQuestions] = useState(getRandomQuestions());
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });
  const [timer, setTimer] = useState(10); 

  useEffect(() => {
    let timerInterval;

    if (timer > 0 && !showResult) {
      timerInterval = setInterval(() => {
        setTimer(prev => prev - 1);
        if (timer === 1) {
          setShowResult(true); 
        }
      }, 1000);
    }

    return () => {
      clearInterval(timerInterval);
    };
  }, [timer, showResult]);
 
  const nextQuestion = () => {
    setResult((prev) =>
      selectedAnswers[activeQuestion]
        ? {
            ...prev,
            score: prev.score + 1,
            correctAnswers: prev.correctAnswers + 1,
          }
        : {
            ...prev,
            wrongAnswers: prev.wrongAnswers + 1,
          } 
    );

    if (activeQuestion !== randomQuestions.length - 1) {
      setActiveQuestion((prev) => prev + 1);
    } else {
      setShowResult(true);
      clearInterval(timer);
    }
  }

  const restartQuiz = () => {
    setActiveQuestion(0);
    setSelectedAnswers([]);
    setShowResult(false);
    setResult({
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
    });
    setRandomQuestions(getRandomQuestions());
    setTimer(300); 
  };

  const onAnswerSelected = (answer, id) => {
    setSelectedAnswers(prevAnswers => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[activeQuestion] = answer;
      return updatedAnswers;
    });
  };

  let questionComponent = null;
  if (randomQuestions.length > 0) {
    const { question, answers } = randomQuestions[activeQuestion];

    questionComponent = (
      <div className='quiz-container'>
        <h3>{question}</h3>
        <ul>
          {answers.map((answer, id) => (
            <li
              onClick={() => onAnswerSelected(answer, id)}
              key={id}
              className={selectedAnswers[activeQuestion] === answers[id] ? 'li-selected' : 'li-hover'}
            >
              <span>{answer}</span>
            </li>
          ))}
        </ul>
        <button onClick={nextQuestion} className="btn">
          {activeQuestion === randomQuestions.length - 1 ? 'Submit' : 'Next'}
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Quiz Page</h1>
      <div>
        <h2>Question: {activeQuestion + 1}/10</h2>
        <h2>Time Remaining: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</h2>
      </div>
      <div>
        {!showResult ? (
          questionComponent
        ) : (
          <div className='quiz-container'>
            <h3>Results</h3>
            <p>Score: <span>{result.score}/10</span></p>
            <h3>Your Answers</h3>
            {randomQuestions.map((q, index) => (
              <div key={index}>
                <span className="yourAnswer">Question {index + 1} - {selectedAnswers[index] ? selectedAnswers[index] : "Not answered"}</span>
                <span className="correctAnswer">Correct Answer: {q.answers[q.correct_index]}</span>
              </div>
            ))}
            <button onClick={restartQuiz} className="btn">Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
