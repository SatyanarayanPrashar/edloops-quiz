type QuizQuestion = {
    question: string;
    options: [string, string, string, string];
    correctOption: number;
  };
  
export type QuizData = {
    title: string;
    topic: string;
    questions: QuizQuestion[];
};