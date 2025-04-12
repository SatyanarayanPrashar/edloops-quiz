"use client"

import Lottie from "lottie-react";
import React from "react";

import happyEmoji from '@/app/assets/lottie/happyface.json';
import sadEmoji from '@/app/assets/lottie/sadface.json';

interface QuizSlideProps {
  index: number;
  quizDetail: {
    question: string;
    options: string[];
    correctOption: number;
  };
  selectedOption: number;
  answerStatus: null | "correct" | "incorrect";
  bgColor: string;
  onOptionClick: (quizIndex: number, optionIndex: number) => void;
  title: string;
  topic: string;
}

export const QuizSlide: React.FC<QuizSlideProps> = ({
  index,
  quizDetail,
  selectedOption,
  answerStatus,
  bgColor,
  onOptionClick,
  title,
  topic,
}) => {
  return (
    <div className={`h-full ${bgColor} rounded-lg flex flex-col justify-between p-5`}>
      <div>
        <p className="text-[24px]">{title}</p>
        <p className="text-[14px]">{topic}</p>
      </div>

      <div>
        <div className="text-white font-medium mb-3">{quizDetail.question}</div>
        <div className="space-y-2">
          {quizDetail.options.map((option, idx) => {
            let bg = "bg-neutral-100/20 hover:bg-neutral-100/40 border border-neutral-100 hover:border-neutral-200";
            if (selectedOption === idx) {
              bg = answerStatus === "correct" ? "bg-green-400" : "bg-red-400";
            }
            return (
              <div
                key={idx}
                onClick={() => onOptionClick(index, idx)}
                className={`p-2 rounded cursor-pointer ${bg} transition-all`}
              >
                {option}
              </div>
            );
          })}
        </div>

        <div className="flex w-full justify-center">
          {answerStatus === "correct" && <Lottie animationData={happyEmoji} className="w-24 h-24 mt-4" />}
          {answerStatus === "incorrect" && <Lottie animationData={sadEmoji} className="w-24 h-24 mt-4" />}
        </div>
      </div>

      <div className="text-white">Time left: 1 min</div>
    </div>
  );
};