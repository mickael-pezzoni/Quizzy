import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'
import { QuizResult } from '../quiz.model'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-result',
  template: `
  <div class="p-12 text-center space-y-10 h-full">

    <h2 class="text-4xl font-bold text-green-600">🎉 Résultat du Quiz</h2>

    <div class="space-y-6 text-xl text-gray-700">
      <p>
        <span class="font-semibold">Bonnes réponses :</span> {{ quizResult().score }} / {{ quizResult().totalQuestions }}
      </p>
      <p>
        <span class="font-semibold">Mauvaises réponses :</span> {{ quizResult().incorrectAnswers }}
      </p>
    </div>

    <div class="w-full max-w-md mx-auto space-y-2">
      <div class="h-4 w-full bg-gray-300 rounded-full overflow-hidden">
        <div
          class="h-full bg-green-500 transition-all duration-700"
          [style.width.%]="(quizResult().score / quizResult().totalQuestions) * 100">
        </div>
      </div>
      <p class="text-sm text-gray-500">
        {{ (quizResult().score / quizResult().totalQuestions * 100) | number:'1.0-0' }}% de réussite
      </p>
    </div>

    <button
      class="mt-6 bg-blue-600 text-white text-lg px-8 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md"
      (click)="onRestart()">
      🔁 Recommencer le Quiz
    </button>

  </div>


  `,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [``]
})
export class ResultComponent {
    readonly quizResult = input.required<QuizResult>()
    readonly restart = output<void>()
    
    onRestart(): void {
        this.restart.emit()
    }
}