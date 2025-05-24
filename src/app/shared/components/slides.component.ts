import { animate, state, style, transition, trigger } from '@angular/animations'
import { CommonModule } from '@angular/common'
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    computed,
    ContentChild,
    DestroyRef,
    effect,
    HostListener,
    inject,
    input,
    model,
    output,
    TemplateRef,
    untracked,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { interval, Subscription } from 'rxjs'

type DiaporamaControl = 'right' | 'arrowright' | 'left' | 'arrowleft' | 'space'

@Component({
    selector: 'app-slides',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="slide fade" [@slideAnimation]="currentSlideIndex()">
      <ng-container
        [ngTemplateOutlet]="slideTemplate"
        [ngTemplateOutletContext]="{
          $implicit: currentSlide(),
          index: currentSlideIndex(),
          isLastSlide: currentSlideIndex() === slides().length - 1,
          slidesRef: this,
        }"
      ></ng-container>
    </div>
  `,
    styles: `
    .slide {
      flex-direction: column;
      justify-content: center;
      display: flex;
      height: 100%;
      width: 100%;
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('slideAnimation', [
            state('void', style({ opacity: 0 })),
            state('*', style({ opacity: 1 })),
            transition('void => *', [animate('200ms ease-in')]),
            transition('* => void', [animate('200ms ease-out')]),
            transition('* => *', [
                style({ opacity: 0.5, transform: 'scale(0.9)' }),
                animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
            ]),
        ]),
    ],
})
export class SlidesComponent<T> implements AfterViewInit {
    private readonly keyPessFunction: {
        [key in DiaporamaControl]: () => void
    } = {
            right: () => this.moveRight(),
            arrowright: () => this.moveRight(),
            left: () => this.moveLeft(),
            arrowleft: () => this.moveLeft(),
            space: () => this.#togglePlayChange(),
        }

    /**
     * A function to asynchronously load an item of type T.
     * This function is used to process slides that need to be loaded.
     * It's an input property that can be configured externally.
     * By default, it returns a promise that resolves with the item itself.
     */
    readonly itemLoaderFunction = input<(item: T) => Promise<T>>((item: T) =>
        Promise.resolve(item),
    )
    readonly slides = model.required<T[]>()
    /**
     * Defines the number of neighboring slides to be processed and loaded
     * around the current slide index. It's an input property that can be
     * configured externally, defaulting to 1.
     */
    readonly neighbors = input<number>(1)

    /**
     * Determines whether the slides should change automatically or not.
     * This is an input property that can be configured externally, defaulting to true.
     */
    readonly shouldChangeAuto = model<boolean>(true)
    readonly mustEnableSlideChange = input<boolean>(true)
    readonly currentSlideIndex = model<number>(0)
    readonly indexToLoop = input(0)
    readonly slideDuration = input<number>(3000)
    readonly skipSlideIndex = input<number | undefined>(undefined)
    readonly slideChange = output<T>()

    readonly currentSlide = computed<T>(() => {
        const slideIndex = this.currentSlideIndex()
        return this.slides()[slideIndex]
    })

    #changeAutoSlideSubcription?: Subscription

    @ContentChild('slide', { static: true }) slideTemplate!: TemplateRef<unknown>
    readonly #destroyRef = inject(DestroyRef)

    constructor() {
        effect(() => {
            const shouldChangeAuto = this.shouldChangeAuto()
            untracked(() => {
                if (shouldChangeAuto) {
                    this.activateAutoSlide()
                } else {
                    this.stopAutoSlide()
                }
            })
        })
    }

    @HostListener('document:keyup', ['$event'])
    async keyArrowPress(event: KeyboardEvent): Promise<void> {
        if (!this.mustEnableSlideChange()) return
        const control = event.code.toLowerCase()
        if (!this.#isDiaporamaControl(control)) return
        if (control !== 'space') {
            this.shouldChangeAuto.set(false)
        }
        this.keyPessFunction[control]()
        const currentSlide = this.currentSlide()
        if (currentSlide) {
            this.slideChange.emit(currentSlide)
        }
        event.stopPropagation()
        event.preventDefault()
    }

    ngAfterViewInit(): void {
        void this.processItemsAroundIndex()
    }

    #isDiaporamaControl(code: string): code is DiaporamaControl {
        return ['right', 'arrowright', 'left', 'arrowleft', 'space'].includes(code)
    }

    /**
     * Activates automatic slide transition.
     * This method sets up a subscription that periodically changes slides
     * at an interval specified by the `slideDuration` property.
     * The subscription is automatically cleaned up when the
     * component is destroyed, thanks to the `takeUntilDestroyed` operator.
     */
    activateAutoSlide(): void {
        if (this.#changeAutoSlideSubcription) return

        this.#changeAutoSlideSubcription = interval(this.slideDuration())
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(() => {
                this.moveRight()
                this.processItemsAroundIndex()
            })
    }

    stopAutoSlide(): void {
        this.#changeAutoSlideSubcription?.unsubscribe()
        this.#changeAutoSlideSubcription = undefined
    }

    /**
     * Processes and loads the items around the specified index.
     * It calculates the indices of neighboring slides based on the current index
     * and the defined number of neighbors. It then attempts to load these slides
     * asynchronously using the provided item loader function.
     *
     * @param index - The index of the current slide for which neighboring slides
     *                need to be processed and loaded.
     * @returns A Promise that resolves once all necessary slides have been processed
     *          and their content is loaded.
     */
    async processItemsAroundIndex(
        index: number = this.currentSlideIndex(),
    ): Promise<void> {
        // Create an empty array to store the indices of neighboring slides
        const indexesToLoad: number[] = []
        // Loop over the number of neighbors before and after the current index
        for (
            let i = index - this.neighbors();
            i <= index + this.neighbors();
            i += 1
        ) {
            // Calculate the index while accounting for overflow
            // If i is negative, this computes the index from the end of the array
            // If i exceeds the length of the array, it wraps around to start from index 0
            const id = (i + this.slides().length) % this.slides().length
            // Add the computed index to the array of indices
            indexesToLoad.push(id)
        }

        const slidesLoaded = await Promise.all(
            this.slides().map((slide, i) =>
                indexesToLoad.includes(i) ? this.itemLoaderFunction()(slide) : slide,
            ),
        )

        this.slides.set(slidesLoaded)
    }

    moveRight(): void {
        try {
            this.currentSlideIndex.update((currentIndex) =>
                this.#increment(currentIndex),
            )
            this.processItemsAroundIndex(this.currentSlideIndex())
        } catch {
            // intentional
        }
    }

    #increment(currentIndex: number): number {
        if (this.slides().length === 0) {
            return -1
        }

        const nextIndex =
            currentIndex + 1 >= this.slides().length
                ? this.indexToLoop()
                : currentIndex + 1

        const skipIndex = this.skipSlideIndex()

        if (skipIndex === undefined || skipIndex !== nextIndex) {
            return nextIndex
        }

        if (nextIndex === currentIndex) {
            throw new Error('Infinite loop detected')
        }

        return this.#increment(nextIndex)
    }

    moveLeft(): void {
        try {
            this.currentSlideIndex.update((currentIndex) =>
                this.#decrement(currentIndex),
            )
            this.processItemsAroundIndex(this.currentSlideIndex())
        } catch {
            // intentional
        }
    }

    #decrement(currentIndex: number): number {
        if (this.slides().length === 0) {
            return -1
        }

        const previousIndex =
            currentIndex === this.indexToLoop()
                ? this.slides().length - 1
                : currentIndex - 1

        const skipIndex = this.skipSlideIndex()

        if (skipIndex === undefined || skipIndex !== previousIndex) {
            return previousIndex
        }

        if (previousIndex === currentIndex) {
            throw new Error('Infinite loop detected')
        }

        return this.#decrement(previousIndex)
    }

    #togglePlayChange(): void {
        this.shouldChangeAuto.update((oldStatus) => !oldStatus)
    }
}