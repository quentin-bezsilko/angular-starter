import { Component, EventEmitter, Input, Output } from "@angular/core";
import type { ImportResult } from "../../model/sample";

@Component({
  selector: "app-sample-import-result",
  standalone: true,
  templateUrl: "./sample-import-result.html",
  styleUrl: "./sample-import-result.scss",
})
export class SampleImportResult {
  @Input({ required: true })
  result!: ImportResult;

  @Output()
  closed = new EventEmitter<void>();
}
