export interface Quiz {
    id: string;
    title: string;
    description: string;
    questions: Question[];
}
export interface Question {
    id: string;
    image?: string;
    question: string;
    answers: Answer[];
}

export interface Answer {
    id: string;
    answer: string;
    isCorrect: boolean;
}
export interface QuizResult {
    quizId: string;
    score: number;
    totalQuestions: number;
    incorrectAnswers: number
}
