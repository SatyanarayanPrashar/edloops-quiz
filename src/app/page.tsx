"use client";

import { useState } from 'react';
import { QuizData } from '@/app/types/quiz';
import { useMediaQuery } from "usehooks-ts";
import { cn } from '@/app/lib/utils';
import loadingIcon from "@/app/assets/lottie/loading.json";
import Lottie from 'lottie-react';
import QuizDisplay from './component/swiperContainer';
import QuizLanding from './component/options';
import { Logo } from './component/logo';

export default function Home() {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [answerStatus, setAnswerStatus] = useState<(null | "correct" | "incorrect")[]>([]);
  const [randomBgColors, setRandomBgColors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [level, setLevel] = useState("");
  const [topic, setTopic] = useState("");

  const isMobile = useMediaQuery("(max-width: 768px)");

  const bgColors = [
    "bg-gradient-to-br from-pink-400 via-red-400 to-yellow-400",
    "bg-gradient-to-br from-purple-400 via-blue-400 to-green-400",
    "bg-gradient-to-br from-yellow-300 via-orange-400 to-pink-500",
    "bg-gradient-to-br from-green-300 via-teal-400 to-blue-500",
    "bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400",
  ];

  const handleOptionClick = (quizIndex: number, optionIndex: number) => {
    // Allow selection only if not already answered
    if (selectedOptions[quizIndex] !== -1) return;

    const isCorrect = optionIndex === quizData?.questions[quizIndex].correctOption;
    const updatedSelections = [...selectedOptions];
    const updatedStatus = [...answerStatus];

    updatedSelections[quizIndex] = optionIndex;
    updatedStatus[quizIndex] = isCorrect ? "correct" : "incorrect";

    // setSelectedOptions(updatedSelections);
    setAnswerStatus(updatedStatus);
  };

  const fetchQuiz = async ({ topic, difficulty }: { topic: string, difficulty: string }) => {
    // Guard against fetch if topic or difficulty is missing (shouldn't happen with button logic, but good practice)
    if (!topic || !difficulty) {
      console.error("Topic or difficulty missing.");
      return;
    }
    setIsLoading(true);
    setQuizData(null); // Reset quiz data before fetching new one
    try {
      const res = await fetch("", {
        method: "POST",
        headers: { // Added Headers for JSON
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic,
          difficulty: difficulty,
        }),
      });

      if (!res.ok) { // Check for HTTP errors
        throw new Error(`Failed to fetch quiz: ${res.statusText}`);
      }

      const data = await res.json();
      const quiz = data.quiz;

      if (!quiz || !quiz.questions || quiz.questions.length === 0) {
        throw new Error("Received invalid quiz data structure");
      }

      setQuizData(quiz);
      setSelectedOptions(Array(quiz.questions.length).fill(-1));
      setAnswerStatus(Array(quiz.questions.length).fill(null));

      const colors = quiz.questions.map(() => {
        const randomIndex = Math.floor(Math.random() * bgColors.length);
        return bgColors[randomIndex];
      });
      setRandomBgColors(colors);
    } catch (error) {
      console.error("Failed to fetch quiz:", error);
      setQuizData(null); // Ensure quizData is null on error
      // Optionally: set an error state here to show a specific message
    } finally {
      setIsLoading(false);
    };
  };

  return (
    <div className="h-screen bg-[#020617] flex items-center justify-center relative">
      {/* {!isMobile && <Logo classname="absolute top-4 left-4 z-10" />} */}

      {/* Condition 1: Show Loading Indicator */}
      {isLoading && (
        <div className={cn("h-[95vh] w-[30vw] bg-gradient-to-br from-purple-400 via-blue-400 to-green-400 rounded-2xl flex flex-col items-center justify-center text-white p-4 text-center", isMobile && "w-full h-full rounded-none")}>
          {!isMobile && <Logo classname="absolute top-4 left-4 z-10" />}
          <Lottie animationData={loadingIcon} className="w-24 h-24" />
          <p className="mt-4 text-lg font-medium">Preparing questions for you...</p>
        </div>
      )}

      {/* Condition 2: Show Quiz if not loading and data exists */}
      {!isLoading && quizData && (
        <QuizDisplay
            quizData={quizData}
            selectedOptions={selectedOptions}
            answerStatus={answerStatus}
            randomBgColors={randomBgColors}
            handleOptionClick={handleOptionClick}
            isMobile={isMobile}
            // No need to pass ref-related props anymore
        />
      )}

      {/* Condition 3: Show Landing Page if not loading and no data */}
      {!isLoading && !quizData && (
        <QuizLanding
          topic={topic}
          level={level}
          setTopic={setTopic}
          setLevel={setLevel}
          fetchQuiz={() => fetchQuiz({ topic, difficulty: level })}
        />
      )}
    </div>
  );
}
