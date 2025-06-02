import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  signal,
  untracked,
  viewChild,
} from "@angular/core";
import { ResponsesComponent } from "./responses/responses.component";
import { RouterModule } from "@angular/router";
import { Question, Quiz, QuizResult } from "./quiz.model";
import { SlidesComponent } from "../../shared/components/slides.component";
import { ResultComponent } from "./result/result.component";
import { QuizService, QuizStorage } from "./quiz.service";

@Component({
  selector: "app-quiz",
  template: `
    <div class="fixed top-0 w-full flex justify-between p-5 z-1">
      <a
        routerLink="/home"
        class="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm px-4 py-2 rounded-lg shadow-md transition z-50"
      >
        🏠 Accueil
      </a>

      <a
        href="#"
        class=" bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm px-4 py-2 rounded-lg shadow-md transition z-50"
        download
      >
        ⬇️ Télécharger le quiz
      </a>
    </div>
    <div class="flex-1 flex items-center justify-center h-full relative">
      <div
        class="w-full sm:max-w-xl min-h-[600px] flex justify-center items-center flex-col bg-white rounded-2xl shadow-lg p-8"
      >
        @if (!isFinish()) {

        <app-slides
          #slides
          [shouldChangeAuto]="false"
          [mustEnableSlideChange]="false"
          class="w-full"
          [(currentSlideIndex)]="questionIndex"
          [slides]="questions()"
        >
          <ng-template
            #slide
            let-currentSlide
            let-index="index"
            let-isLastSlide="isLastSlide"
          >
            <div class="flex justify-between items-center mb-4 w-full">
              <h2 class="text-2xl font-bold">Question {{ index + 1 }}</h2>
              <span class="text-gray-500"
                >{{ index + 1 }} sur {{ questions().length }}</span
              >
            </div>

            <div class="mb-6">
              <img
                [src]="currentSlide?.image"
                alt="Image de la question"
                class="w-full h-auto sm:min-h-[200px] sm:max-h-[300px] object-contain rounded-lg shadow-md"
              />
            </div>

            <p class="text-lg mb-6">{{ currentSlide.question }}</p>

            <app-responses
              #responses
              [answers]="currentSlide.answers"
              [selectedAnswer]="userAnswers()[currentSlide.id]"
              (selectedAnswerChange)="onSelect(currentSlide, $event)"
            />

            <div class="mt-6 flex justify-between">
              @let isDisabled = !responses.selectedAnswer() || isLastSlide;

              <button
                [disabled]="index === 0"
                (click)="slides.moveLeft()"
                class="px-6 py-2 rounded-lg transition 
         bg-green-600 text-white hover:bg-green-700
         disabled:bg-green-300 disabled:text-green-700 
         disabled:cursor-not-allowed disabled:opacity-50"
              >
                ← Précédent
              </button>

              <button
                (click)="slides.moveRight()"
                [disabled]="isDisabled"
                class="px-6 py-2 rounded-lg transition 
         bg-blue-600 text-white hover:bg-blue-700
         disabled:bg-blue-300 disabled:text-blue-700 
         disabled:cursor-not-allowed disabled:opacity-50"
              >
                Suivant →
              </button>
            </div>
          </ng-template>
        </app-slides>
        } @else {
        <app-result (restart)="onRestart()" [quizResult]="quizResult()" />
        }
      </div>
    </div>
  `,
  imports: [ResponsesComponent, RouterModule, SlidesComponent, ResultComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "h-full",
  },
  styles: [``],
})
export class QuizComponent {
  readonly responsesComponent = viewChild(ResponsesComponent);
  readonly quizService = inject(QuizService);
  readonly questionIndex = linkedSignal(
    () => this.quiz().currentQuestionIndex || 0
  );
  readonly isFinish = computed(
    () =>
      Object.keys(this.userAnswers()).length === this.quiz().questions.length
  );
  readonly userAnswers = linkedSignal<Record<string, string>>(
    () => this.quiz()?.userAnswers || {}
  );
  readonly quizResult = computed<QuizResult>(() => {
    const quiz = this.quiz();
    const answers = this.userAnswers();
    const totalQuestions = quiz.questions.length;
    const correctAnswers = quiz.questions.filter((question) => {
      const goodAnswer = question.answers.find((answer) => answer.isCorrect);
      return answers?.[question.id] === goodAnswer?.id;
    }).length;
    const incorrectAnswers = totalQuestions - correctAnswers;

    return {
      score: correctAnswers,
      quizId: quiz.id,
      incorrectAnswers,
      totalQuestions,
    };
  });

  constructor() {
    effect(() => {
      const userAnswers = this.userAnswers();
      untracked(() => {
        this.quizService.setQuiz({
          ...this.quiz(),
          currentQuestionIndex: Object.keys(userAnswers).length,
          userAnswers,
        });
      });
    });
  }

  readonly quiz = signal<QuizStorage>(this.quizService.quiz() as Quiz);

  readonly questions = linkedSignal(() => this.quiz().questions);

  onSelect(question: Question, answerId: string | undefined): void {
    if (!answerId) return;
    this.userAnswers.update((answers) => ({
      ...answers,
      [question.id]: answerId,
    }));
  }

  onRestart(): void {
    this.questionIndex.set(0);
    this.userAnswers.set({});
  }
}
