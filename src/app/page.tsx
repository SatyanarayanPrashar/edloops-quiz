"use client";

import { useState, useEffect } from 'react'; // Add useEffect
import dynamic from 'next/dynamic'; // Import dynamic
import { QuizData } from '@/app/types/quiz';
// Remove useMediaQuery import here if only used within QuizDisplay or dynamically loaded components
// import { useMediaQuery } from "usehooks-ts";
import { cn } from '@/app/lib/utils';
import loadingIcon from "@/app/assets/lottie/loading.json";
// Dynamically import Lottie with ssr: false
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import QuizLanding from './component/options';
import { Logo } from './component/logo';

// Dynamically import QuizDisplay with ssr: false
const QuizDisplay = dynamic(() => import('./component/swiperContainer'), {
  ssr: false,
  // Optional: Add a loading component while QuizDisplay loads
  // loading: () => <p>Loading quiz interface...</p>,
});

export default function Home() {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [answerStatus, setAnswerStatus] = useState<(null | "correct" | "incorrect")[]>([]);
  const [randomBgColors, setRandomBgColors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [level, setLevel] = useState("");
  const [topic, setTopic] = useState("");

  // If you still need isMobile directly in Home, handle it safely:
  const [isMobile, setIsMobile] = useState(false); // Default value
  useEffect(() => {
    // This effect runs only on the client
    const checkMobile = () => window.matchMedia("(max-width: 768px)").matches;
    setIsMobile(checkMobile());
    // Optional: Add resize listener if needed
  }, []); // Empty dependency array ensures it runs once on mount

  const bgColors = [
    // ... (keep your colors)
  ];

  const handleOptionClick = (quizIndex: number, optionIndex: number) => {
    // ... (keep your logic)
  };

  const fetchQuiz = async ({ topic, difficulty }: { topic: string, difficulty: string }) => {
    // ... (keep your logic)
  };

  return (
    <div className="h-screen bg-[#020617] flex items-center justify-center relative">
      {/* {!isMobile && <Logo classname="absolute top-4 left-4 z-10" />} */}

      {isLoading && (
        <div className={cn("h-[95vh] w-[30vw] bg-gradient-to-br from-purple-400 via-blue-400 to-green-400 rounded-2xl flex flex-col items-center justify-center text-white p-4 text-center", isMobile && "w-full h-full rounded-none")}>
          {/* Lottie is now dynamically imported, so it's safe */}
          {!isMobile && <Logo classname="absolute top-4 left-4 z-10" />}
          <Lottie animationData={loadingIcon} className="w-24 h-24" />
          <p className="mt-4 text-lg font-medium">Preparing questions for you...</p>
        </div>
      )}

      {/* QuizDisplay is now dynamically imported, ensuring it only renders client-side */}
      {!isLoading && quizData && (
        <QuizDisplay
            quizData={quizData}
            selectedOptions={selectedOptions}
            answerStatus={answerStatus}
            randomBgColors={randomBgColors}
            handleOptionClick={handleOptionClick}
            // isMobile prop is needed by QuizDisplay, pass the state
            isMobile={isMobile}
        />
      )}

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