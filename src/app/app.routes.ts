import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'home' , loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
    { path: 'quiz' , loadComponent: () => import('./features/quiz/quiz.component').then(m => m.QuizComponent) },
    { path: 'builder' , loadComponent: () => import('./features/builder/builder.component').then(m => m.BuilderCmponent) },
    {path: '', redirectTo: 'home', pathMatch: 'full'},
];
