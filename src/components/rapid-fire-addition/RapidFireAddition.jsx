import React, { useState, useRef, useEffect } from 'react';

export default function RapidFireAddition() {
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [problem, setProblem] = useState(generateProblem());
  const [answer, setAnswer] = useState('');
  const [shake, setShake] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const timerId = useRef(null);
  const inputRef = useRef(null);

  function generateProblem() {
    const a = Math.floor(Math.random() * 90) + 10;
    const b = Math.floor(Math.random() * 90) + 10;
    return { a, b };
  }

  function startGame() {
    setStarted(true);
    setScore(0);
    setTimeLeft(60);
    setProblem(generateProblem());
    setAnswer('');
    setShake(false);
    setShowCheck(false);
    setTimeout(() => inputRef.current && inputRef.current.focus(), 0);
  }

  function handleAnswer(e) {
    e.preventDefault();
    if (parseInt(answer) === problem.a + problem.b) {
      setScore(s => s + 1);
      setShowCheck(true);
      setTimeout(() => setShowCheck(false), 600);
      setShake(false);
      setProblem(generateProblem());
      setAnswer('');
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
    setTimeout(() => inputRef.current && inputRef.current.focus(), 0);
  }

  useEffect(() => {
    if (started && timeLeft > 0) {
      timerId.current = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    }
    return () => {
      if (timerId.current) {
        clearInterval(timerId.current);
        timerId.current = null;
      }
    };
  }, [started, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && timerId.current) {
      clearInterval(timerId.current);
      timerId.current = null;
    }
  }, [timeLeft]);

  // Modern card container
  const cardClass =
    "w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6 border border-gray-100 dark:border-neutral-800 transition-all duration-300";
  const timerClass =
    "text-3xl font-extrabold tracking-widest px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-400 via-indigo-600 to-indigo-400 text-white shadow-md animate-pulse";
  const scoreClass =
    "text-lg font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-neutral-800 px-4 py-2 rounded-lg shadow-sm transition-all duration-200";
  const inputClass =
    `border-2 border-indigo-300 dark:border-indigo-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-2xl w-28 text-center bg-gray-50 dark:bg-neutral-800 text-gray-800 dark:text-gray-100 transition-all duration-200 ${shake ? 'animate-shake border-red-500' : ''}`;
  const buttonClass =
    "bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-all duration-200 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400";

  // Animation keyframes and checkmark style
  const style = (
    <style>{`
      @keyframes shake {
        0% { transform: translateX(0); }
        20% { transform: translateX(-8px); }
        40% { transform: translateX(8px); }
        60% { transform: translateX(-8px); }
        80% { transform: translateX(8px); }
        100% { transform: translateX(0); }
      }
      .animate-shake {
        animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
      }
      .checkmark-anim {
        animation: checkmark-pop 0.6s cubic-bezier(.36,.07,.19,.97) both;
      }
      @keyframes checkmark-pop {
        0% { opacity: 0; transform: scale(0.5); }
        40% { opacity: 1; transform: scale(1.2); }
        70% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0.8); }
      }
    `}</style>
  );

  if (!started) {
    return (
      <div className="flex flex-col items-center gap-4">
        {style}
        <div className={cardClass}>
          <span className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">Ready...</span>
          <span className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">Set...</span>
          <button className={buttonClass} onClick={startGame}>
            Go!
          </button>
        </div>
      </div>
    );
  }

  if (timeLeft === 0) {
    return (
      <div className="flex flex-col items-center gap-4">
        {style}
        <div className={cardClass + " text-center"}>
          <div className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-300 mb-2">Time's up!</div>
          <div className="text-xl mb-4">Your score: <span className="font-extrabold text-indigo-600 dark:text-indigo-200 animate-bounce">{score}</span></div>
          <button className={buttonClass} onClick={startGame}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {style}
      <div className={cardClass}>
        <div className="flex items-center justify-between w-full mb-2">
          <div className={scoreClass}>Score: <span className="animate-bounce inline-block">{score}</span></div>
          <div className={timerClass}>{timeLeft}s</div>
        </div>
        <div className="relative w-full flex flex-col items-center">
          <div className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-300 mb-4 drop-shadow-lg">{problem.a} + {problem.b} = ?</div>
          {showCheck && (
            <span className="absolute top-0 right-0 checkmark-anim text-green-500 text-4xl select-none">
              ✓
            </span>
          )}
        </div>
        <form onSubmit={handleAnswer} className="flex gap-3 w-full justify-center mb-2">
          <input
            ref={inputRef}
            type="tel"
            className={inputClass}
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            autoFocus
          />
          <button className={buttonClass} type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
