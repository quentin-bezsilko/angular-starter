import { Component, EventEmitter, Input, Output } from "@angular/core";
import { RouterLink } from "@angular/router";
import { DatePipe } from "@angular/common";

import type { Sample, SortColumn } from "../../model/sample";
import { SampleStatus } from "../../model/sample";

@Component({
  selector: "app-sample-table",
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: "./sample-table.html",
  styleUrl: "./sample-table.scss",
})
export class SampleTable {
  @Input({ required: true })
  samples: Sample[] = [];

  @Input()
  loading = false;

  @Input({ required: true })
  canRead = false;

  @Input({ required: true })
  canWrite = false;

  @Input({ required: true })
  selectedIds = new Set<number>();

  @Input({ required: true })
  sortColumn = "";

  @Input({ required: true })
  sortDirection: "asc" | "desc" = "asc";

  @Output()
  sort = new EventEmitter<SortColumn>();

  @Output()
  toggleFavorite = new EventEmitter<Sample>();

  @Output()
  duplicate = new EventEmitter<number>();

  @Output()
  moveToTrash = new EventEmitter<number>();

  @Output()
  toggleSelection = new EventEmitter<{ id: number; checked: boolean }>();

  @Output()
  toggleAll = new EventEmitter<boolean>();

  readonly SampleStatus = SampleStatus;

  isSelected(id: number): boolean {
    return this.selectedIds.has(id);
  }

  areAllSelected(): boolean {
    return (
      this.samples.length > 0 &&
      this.samples.every((sample) => this.selectedIds.has(sample.id))
    );
  }

  sortSymbol(column: string): string {
    if (this.sortColumn !== column) {
      return "↕";
    }

    return this.sortDirection === "asc" ? "↑" : "↓";
  }

  statusLabel(status: SampleStatus): string {
    switch (status) {
      case SampleStatus.CREATED:
        return "Créé";
      case SampleStatus.ACTIVE:
        return "Actif";
      case SampleStatus.ARCHIVED:
        return "Archivé";
      case SampleStatus.DELETED:
        return "Dans la corbeille";
    }
  }

  onToggleSelection(id: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.toggleSelection.emit({
      id,
      checked,
    });
  }
}
