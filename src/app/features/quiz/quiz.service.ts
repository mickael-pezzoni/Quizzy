import { Injectable } from "@angular/core";
import { Quiz } from "./quiz.model";

@Injectable({providedIn: "root"})
export class QuizService {
    quiz?: Quiz = this.getQuiz();

    getQuiz(): Quiz | undefined {
        const quiz = localStorage.getItem("quiz");
        if (quiz) {
            return JSON.parse(quiz) as Quiz;
        }
        return undefined
    }

    setQuiz(quiz: Quiz): void {
        localStorage.setItem("quiz", JSON.stringify(quiz));
        this.quiz = quiz;
    }
}