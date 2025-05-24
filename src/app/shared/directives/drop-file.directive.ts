import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  Host,
  HostBinding,
  HostListener,
  input,
  output,
  signal,
} from "@angular/core";

@Directive({
  selector: "[appDropFile]",
})
export class DropFileDirective {
  @HostBinding("class") get class(): string {
    return this.isDragOver() ? this.dragOverClass() : "";
  }

  readonly dragOverClass = input.required<string>();
  readonly fileDroped = output<File>();
  readonly isDragOver = signal(false);

  @HostListener("drop", ["$event"])
  private onDrop(event: DragEvent): void {
    event.preventDefault();
    const item = event.dataTransfer?.items?.[0];
    if (!item || item.kind !== "file") {
      return;
    }

    const file = item.getAsFile();
    if (file && file.type.includes('json')) {
      this.fileDroped.emit(file);
    }
  }

  @HostListener("dragover", ["$event"])
  private onDragOber(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  @HostListener("dragleave")
  private onDragLeave(): void {
    this.isDragOver.set(false);
  }
}
