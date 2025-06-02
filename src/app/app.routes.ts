import { Routes } from "@angular/router";
import { CanAccessQuizGuard } from "./core/can-access-quiz.guard";

export const routes: Routes = [
  {
    path: "home",
    loadComponent: () =>
      import("./features/home/home.component").then((m) => m.HomeComponent),
  },
  {
    path: "quiz",
    loadComponent: () =>
      import("./features/quiz/quiz.component").then((m) => m.QuizComponent),
    canActivate: [CanAccessQuizGuard],
  },
  {
    path: "builder",
    loadComponent: () =>
      import("./features/builder/builder.component").then(
        (m) => m.BuilderCmponent
      ),
  },
  { path: "", redirectTo: "home", pathMatch: "full" },
];
