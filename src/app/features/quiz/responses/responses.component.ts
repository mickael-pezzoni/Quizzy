import { ChangeDetectionStrategy, Component, model, output, signal, ViewEncapsulation } from '@angular/core'
import { Answer } from '../quiz.model'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-responses',
    template: `

    @for(answer of answers(); track answer.id) {
    <button [disabled]="selectedAnswer() !== undefined" (click)="onSelect(answer)" class="w-full bg-gray-100  p-4 rounded-lg text-left transition"
        [class.correct]="selectedAnswer() && answer.isCorrect"
        [class.bad_response]="answer.id === selectedAnswer() && !answer.isCorrect"
        [class.actif]="selectedAnswer() === undefined"
    >
      {{$index + 1}}. {{ answer.answer}}
    </button>

    }
  `,
    imports: [CommonModule],
    host: {
        class: 'space-y-4'
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrl: './responses.component.css',
})
export class ResponsesComponent {
    readonly answers = model.required<Answer[]>()
    readonly selectedAnswer = model<string | undefined>()
    // readonly currentAnswer = linkedSignal(() => this.selectedAnswer())
    readonly selectAnswer = output<string>()
    onSelect(answer: Answer) {
        this.selectedAnswer.set(answer.id)
        // this.selectAnswer.emit(answer.id)
    }

}