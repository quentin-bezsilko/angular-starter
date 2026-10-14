import { Component, EventEmitter, Input, Output } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-sample-toolbar",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./sample-toolbar.component.html",
  styleUrl: "./sample-toolbar.component.scss",
})
export class SampleToolbarComponent {
  @Input() canRead = false;
  @Input() canWrite = false;

  @Output() export = new EventEmitter<void>();
  @Output() import = new EventEmitter<File>();

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    this.import.emit(input.files[0]);
    input.value = "";
  }
}