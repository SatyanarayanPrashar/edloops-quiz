'use client';

import { useRef, useEffect, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { FaCircleArrowDown, FaCircleArrowUp } from 'react-icons/fa6';
import { useMediaQuery } from "usehooks-ts"; // Keep if needed *only* within this component

import { cn } from '@/app/lib/utils';
import { QuizData } from '../types/quiz';
import { QuizSlide } from './quiz_slides'; // Corrected path assumption
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles if you haven't already (usually in _app.tsx or layout.tsx for Pages Router, but here might be okay too if dynamically loaded)
import 'swiper/css';
// Import specific modules if needed, e.g., Navigation, Pagination
// import 'swiper/css/navigation';
// import { Navigation } from 'swiper/modules'; // Example

interface QuizDisplayProps {
    quizData: QuizData;
    selectedOptions: number[];
    answerStatus: (null | "correct" | "incorrect")[];
    randomBgColors: string[];
    handleOptionClick: (quizIndex: number, optionIndex: number) => void;
    isMobile: boolean;
}

export default function QuizDisplay({
    quizData,
    selectedOptions,
    answerStatus,
    randomBgColors,
    handleOptionClick,
    isMobile,
}: QuizDisplayProps) {
    const [isMounted, setIsMounted] = useState(false);
    const swiperRef = useRef<SwiperType | null>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleSwiper = (swiper: SwiperType) => {
        swiperRef.current = swiper;
    };

    const slidePrev = () => {
        swiperRef.current?.slidePrev();
    };

    const slideNext = () => {
        swiperRef.current?.slideNext();
    };

    // Ensure this renders only on the client-side
    if (!isMounted) return null;

    return (
        <div className="flex gap-4 items-center ">
            <Swiper
                direction="vertical"
                modules={[]}
                onSwiper={handleSwiper}
                className={cn(
                    "h-[95vh] w-[90vw] sm:w-[50vw] lg:w-[30vw] rounded-2xl overflow-hidden",
                    isMobile && "w-full h-full rounded-none"
                )}
            >
                {quizData.questions.map((quizDetail, index) => (
                    <SwiperSlide key={index}>
                        <QuizSlide
                            index={index}
                            quizDetail={quizDetail}
                            selectedOption={selectedOptions[index]}
                            answerStatus={answerStatus[index]}
                            bgColor={randomBgColors[index]}
                            onOptionClick={handleOptionClick}
                            title={quizData.title}
                            topic={quizData.topic}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {!isMobile && (
                <div className="flex flex-col gap-4">
                    <button
                        onClick={slidePrev}
                        className="text-gray-500 hover:text-neutral-400 transition-colors duration-200"
                    >
                        <FaCircleArrowUp size={40} />
                    </button>
                    <button
                        onClick={slideNext}
                        className="text-gray-500 hover:text-neutral-400 transition-colors duration-200"
                    >
                        <FaCircleArrowDown size={40} />
                    </button>
                </div>
            )}
        </div>
    );
}
