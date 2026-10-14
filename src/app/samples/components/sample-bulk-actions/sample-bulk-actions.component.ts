import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-sample-bulk-actions",
  standalone: true,
  templateUrl: "./sample-bulk-actions.component.html",
  styleUrl: "./sample-bulk-actions.component.scss",
})
export class SampleBulkActionsComponent {
  @Input({ required: true })
  selectedCount = 0;

  @Output()
  export = new EventEmitter<void>();

  @Output()
  duplicate = new EventEmitter<void>();

  @Output()
  activate = new EventEmitter<void>();

  @Output()
  moveToTrash = new EventEmitter<void>();
}
