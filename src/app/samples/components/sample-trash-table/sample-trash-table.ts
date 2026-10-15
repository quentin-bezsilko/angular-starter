import { Component, EventEmitter, Input, Output } from "@angular/core";
import { DatePipe } from "@angular/common";

import type { Sample } from "../../model/sample";

@Component({
  selector: "app-sample-trash-table",
  standalone: true,
  imports: [DatePipe],
  templateUrl: "./sample-trash-table.html",
  styleUrl: "./sample-trash-table.scss",
})
export class SampleTrashTable {
  @Input({ required: true })
  samples: Sample[] = [];

  @Input({ required: true })
  selectedIds = new Set<number>();

  @Input({ required: true })
  sortColumn = "";

  @Input({ required: true })
  sortDirection: "asc" | "desc" = "asc";

  @Output()
  sort = new EventEmitter<string>();

  @Output()
  restore = new EventEmitter<number>();

  @Output()
  deleteForever = new EventEmitter<number>();

  @Output()
  toggleSelection = new EventEmitter<{ id: number; checked: boolean }>();

  isSelected(id: number): boolean {
    return this.selectedIds.has(id);
  }

  onToggleSelection(id: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    this.toggleSelection.emit({
      id,
      checked,
    });
  }

  sortSymbol(column: string): string {
    if (this.sortColumn !== column) {
      return "↕";
    }

    return this.sortDirection === "asc" ? "↑" : "↓";
  }
}
