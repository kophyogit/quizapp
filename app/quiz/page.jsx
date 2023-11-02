'use client';
import React, { useState, useEffect } from "react";
import { quiz } from '../data.js';
const page = () => {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [checked, setChecked] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });
   //timer
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(30)
  useEffect(() => {
    let interval;

    if (minutes > 0 || seconds > 0) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
          } else {
            setMinutes((prev) => prev - 1);
            setSeconds(59);
          }
        } else {
          setSeconds((prev) => prev - 1);
        }
      }, 1000);
    } else {
      setShowResult(true);
    }

    return () => clearInterval(interval);
}, [minutes, seconds]);

  const { questions } = quiz;
  const { question, answers, correctAnswer } = questions[activeQuestion];

  //restart
  const restartQuiz = () => {
    setShowResult(false);
    setSelectedAnswers([]);
    setResult({
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
    });
    setMinutes(1);
    setSeconds(0);
  };
  //answers
  const onAnswerSelected = (answer, id) => {
    setChecked(true);
    setSelectedAnswerIndex(id);
  
    if (answer === correctAnswer) {
      setSelectedAnswer(true);
      console.log('true');
    } else {
      setSelectedAnswer(false);
      console.log('false');
    }
  
    setSelectedAnswers(prevAnswers => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[activeQuestion] = answer;
      return updatedAnswers;
    });
  };
  //next
  const nextQuestion = () => {
    setSelectedAnswerIndex(null)
    setResult((prev) =>
    selectedAnswer
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
    if (activeQuestion !== questions.length - 1) {
        setActiveQuestion((prev) => prev + 1);
    } else {
        setActiveQuestion(0);
        setShowResult(true);
    }
    setChecked(false);
  }
    return (
        <div className="container">
            <h1>Quiz Page</h1>
            <div>
                <h2>
                    Question: {activeQuestion + 1}
                    <span>/{questions.length}</span>
                </h2>
            </div>
            <div>
                {!showResult ? (
                    <div className='quiz-container'>
                        <h3>{questions[activeQuestion].question}</h3>
                        <div className="timer">
                            <label>Timelimit</label><br></br>
                            <span>{minutes}mins:{seconds}s</span>
                        </div>
                        {answers.map((answer, id) => (
                            <li onClick={() => onAnswerSelected(answer, id)} key={id} className={selectedAnswerIndex === id ? 'li-selected' : 'li-hover'}>
                                <span>{answer}</span>
                            </li>
                        ))}
                        {checked ? (
                            <button onClick={nextQuestion} className="btn">{activeQuestion === questions.length - 1 ? 'Submit' : 'Next'}</button>
                        ) : (
                            <button onClick={nextQuestion} disabled className="btn-disabled">
                                {''}
                                {activeQuestion === questions.length - 1 ? 'Submit' : 'Next'}
                            </button>
                        )}
                    </div>
                ) : (
                    <div className='quiz-container'>
                        <h3>Results</h3>
                        <p>Score: <span>{result.score}/10</span></p>
                        <h3>Your Answer</h3>
                        {questions.map((q, index) => (
                        <div key={index}>
                          <span className="yourAnswer">Question {index + 1} - {selectedAnswers[index] ? selectedAnswers[index] : "Not answered"}</span>
                          <span className="correctAnswer">Correct Answer: {q.correctAnswer}</span>
            </div>
))}
                          <button onClick={restartQuiz} className="btn">Try Again</button>
                    </div>
)}
            </div>
        </div>
    )
}

export default page