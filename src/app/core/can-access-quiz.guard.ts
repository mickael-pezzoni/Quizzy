import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { QuizService } from "../features/quiz/quiz.service";

@Injectable()
export class CanAccessQuizGuard implements CanActivate {

    #quizService = inject(QuizService);
    #router = inject(Router);
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
        if (this.#quizService.quiz() !== undefined) {
            return true;
        }
        return this.#router.parseUrl('/home')
    }

}