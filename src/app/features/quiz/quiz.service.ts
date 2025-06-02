import { Injectable, signal } from "@angular/core";
import { Quiz } from "./quiz.model";

export type QuizStorage = Quiz & {
    currentQuestionIndex?: number;
    userAnswers?: Record<string, string>;
}

@Injectable({providedIn: "root"})
export class QuizService {
    readonly quiz = signal<Quiz | undefined>(this.getQuiz());

    getQuiz(): QuizStorage | undefined {
        const quiz = localStorage.getItem("quiz");
        if (quiz) {
            return JSON.parse(quiz) as QuizStorage;
        }
        return undefined
    }

    setQuiz(quiz: QuizStorage): void {
        localStorage.setItem("quiz", JSON.stringify(quiz));
        this.quiz.set(quiz)
    }
}