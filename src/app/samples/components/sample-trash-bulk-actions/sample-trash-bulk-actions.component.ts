import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-sample-trash-bulk-actions",
  standalone: true,
  templateUrl: "./sample-trash-bulk-actions.component.html",
  styleUrl: "./sample-trash-bulk-actions.component.scss",
})
export class SampleTrashBulkActionsComponent {
  @Input({ required: true })
  selectedCount = 0;

  @Output()
  restore = new EventEmitter<void>();

  @Output()
  deleteForever = new EventEmitter<void>();
}