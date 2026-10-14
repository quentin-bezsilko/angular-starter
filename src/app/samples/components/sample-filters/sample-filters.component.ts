import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { SampleStatus } from "../../model/sample.model";

@Component({
  selector: "app-sample-filters",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./sample-filters.component.html",
  styleUrl: "./sample-filters.component.scss",
})
export class SampleFiltersComponent {
  @Input() search = "";
  @Input() status: SampleStatus | "" = "";
  @Input() category = "";
  @Input() active?: boolean;
  @Input() favoritesOnly = false;

  @Input() statuses: SampleStatus[] = [];

  @Output() searchChange = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<SampleStatus | "">();
  @Output() categoryChange = new EventEmitter<string>();
  @Output() activeChange = new EventEmitter<boolean | undefined>();

  @Output() apply = new EventEmitter<void>();
  @Output() reset = new EventEmitter<void>();
  @Output() toggleFavorites = new EventEmitter<void>();

  readonly SampleStatus = SampleStatus;

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
}
