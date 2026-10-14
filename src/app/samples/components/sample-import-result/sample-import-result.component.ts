import { Component, EventEmitter, Input, Output } from "@angular/core";
import type { ImportResult } from "../../model/sample.model";

@Component({
  selector: "app-sample-import-result",
  standalone: true,
  templateUrl: "./sample-import-result.component.html",
  styleUrl: "./sample-import-result.component.scss",
})
export class SampleImportResultComponent {
  @Input({ required: true })
  result!: ImportResult;

  @Output()
  close = new EventEmitter<void>();
}
