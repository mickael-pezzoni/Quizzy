import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { QuizService } from "../quiz/quiz.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  template: `
    <div
      class="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen flex items-center justify-center"
    >
      <div
        class="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 text-center"
      >
        <h1 class="text-3xl font-bold mb-6 text-gray-800">
          Bienvenue dans Quizzy 🎉
        </h1>
        <p class="text-gray-600 mb-8">
          Choisissez une méthode pour démarrer votre quiz :
        </p>

        <!-- Bouton : Générer un quiz -->
        <a
          href="builder.html"
          class="block w-full bg-purple-600 text-white font-semibold py-4 rounded-xl hover:bg-purple-700 transition mb-6"
        >
          ✨ Générer un quiz
        </a>

        <!-- Zone de drop pour importer un quiz -->
        <label
          for="file-input"
          class="block border-4 border-dashed border-blue-300 rounded-xl p-10 bg-blue-50 hover:bg-blue-100 transition cursor-pointer"
        >
          <p class="text-blue-500 font-semibold">
            📂 Glissez-déposez un fichier ici
          </p>
          <p class="text-sm text-gray-500 mt-2">
            ou cliquez pour sélectionner un fichier
          </p>
        </label>
        <input
          type="file"
          id="file-input"
          (change)="onChange($event)"
          class="hidden"
          accept=".json"
        />
      </div>
    </div>
  `,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [``],
})
export class HomeComponent {
  readonly quizService = inject(QuizService)
  readonly router = inject(Router)
  onChange(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = (e.target as FileReader).result;
      if (typeof content === "string") {
        const jsonContent = JSON.parse(content);
        this.quizService.setQuiz(jsonContent);
        this.router.navigateByUrl('quiz')
        console.log(jsonContent);
      }
    };
    if (files && files.length > 0) {
      const file = files[0];
      reader.readAsText(file);
    }
  }
}
