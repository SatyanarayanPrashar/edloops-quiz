"use client";

import { cn } from "@/app/lib/utils";
import { useMediaQuery } from "usehooks-ts";
import { Logo } from "./logo";

export default function QuizLanding({
    topic,
    level,
    setTopic,
    setLevel,
    fetchQuiz,
}: {
    topic: string;
    level: string;
    setTopic: (value: string) => void;
    setLevel: (value: string) => void;
    fetchQuiz: () => void;
}) {
    const isMobile = useMediaQuery("(max-width: 768px)");

    const topics = [
        "LLMs",
        "version control - Git",
        "JavaScript",
        "Python",
        "React",
        "Node.js",
        "TypeScript",
        "CSS",
        "HTML",
        "Databases",
        "Algorithms",
        "Data Structures",
        "DevOps",
        "Machine Learning",
        "Cloud Computing",
        "Cybersecurity",
        "Docker",
        "Kubernetes",
        "Testing",
        "APIs",
    ];

    const levels = ["easy", "medium", "hard", "expert"];

    return (
        <div className="h-screen bg-[#020617] flex flex-col justify-center items-center gap-8 px-4">
            <Logo classname="absolute top-2 left-2" />

            <div className={cn("h-[95vh] w-[30vw] bg-gradient-to-br from-purple-400 via-blue-400 to-green-400 rounded-2xl flex flex-col items-center justify-center", isMobile && "w-full h-[100vh] rounded-none")}>
                <div className="text-white text-xl">Choose a difficulty level:</div>
                <div className="flex gap-1 flex-wrap justify-center">
                    {levels.map((lvl) => (
                        <button
                            key={lvl}
                            onClick={() => setLevel(lvl)}
                            className={`px-4 py-2 rounded-full border transition-all duration-200 ${level === lvl ? "bg-white text-black" : "border-white text-white hover:bg-white hover:text-black"
                                }`}
                        >
                            {lvl}
                        </button>
                    ))}
                </div>

                <div className="text-white text-xl mt-6">Choose a topic:</div>
                <div className="flex flex-wrap justify-center gap-1">
                    {topics.map((tpc) => (
                        <button
                            key={tpc}
                            onClick={() => setTopic(tpc)}
                            className={`px-4 py-2 rounded-full border transition-all duration-200 ${topic === tpc ? "bg-white text-black" : "border-white text-white hover:bg-white hover:text-black"
                                }`}
                        >
                            {tpc}
                        </button>
                    ))}
                </div>

                {topic && level && (
                    <button
                        className="mt-8 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-full transition-all"
                        onClick={() => fetchQuiz()}
                    >
                        Start Quiz
                    </button>
                )}
            </div>
        </div>
    );
}
