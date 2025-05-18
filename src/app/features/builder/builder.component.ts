import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-builder",
  template: `
    <div
      class="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen flex items-center justify-center"
    >
      <div class="w-full max-w-xl bg-white rounded-3xl shadow-xl p-8">
        <h1 class="text-3xl font-bold mb-6 text-gray-800 text-center">
          Générateur de Quiz 🧠
        </h1>
        <p class="text-gray-600 mb-6 text-center">
          Décris ton quiz ci-dessous. Par exemple :<br /><em
            >"Génère un quiz de 5 questions sur l’espace pour des enfants."</em
          >
        </p>

        <form>
          <textarea
            name="quiz-prompt"
            rows="5"
            placeholder="Tape ici ton idée de quiz..."
            class="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
          ></textarea>

          <div class="mt-6 text-center">
            <button
              type="submit"
              class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
            >
              Générer le quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [``],
})
export class BuilderCmponent {}
