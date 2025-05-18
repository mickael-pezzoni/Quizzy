import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'app-builder',
  template: `<div>builder works!</div>`,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [``]
})
export class BuilderCmponent {
}