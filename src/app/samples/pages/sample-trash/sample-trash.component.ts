import type { OnInit } from "@angular/core";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { finalize } from "rxjs";

import type { Sample } from "../../model/sample.model";
import { SampleStatus } from "../../model/sample.model";
import { SampleService } from "../../service/sample.service";
import { SampleBulkService } from "../../service/sample-bulk.service";

type SortDirection = "asc" | "desc";

@Component({
  selector: "app-sample-trash",
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: "./sample-trash.component.html",
  styleUrl: "./sample-trash.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SampleTrashComponent implements OnInit {
  private readonly sampleService = inject(SampleService);
  private readonly sampleBulkService = inject(SampleBulkService);

  readonly samples = signal<Sample[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly selectedIds = signal<Set<number>>(new Set());
  readonly selectedCount = computed(() => this.selectedIds().size);

  readonly sortColumn = signal("id");
  readonly sortDirection = signal<SortDirection>("desc");

  ngOnInit(): void {
    this.loadSamples();
  }

  loadSamples(): void {
    this.loading.set(true);
    this.error.set(null);

    const sort = `${this.sortColumn()},${this.sortDirection()}`;

    this.sampleService
      .findAll(
        0,
        50,
        sort,
        undefined,
        SampleStatus.DELETED,
        undefined,
        undefined,
        true,
      )
      .pipe(
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: (response) => {
          this.samples.set(response.content);
        },
        error: () => {
          this.error.set(
            "Une erreur est survenue lors du chargement de la corbeille.",
          );
        },
      });
  }

  restore(id: number): void {
    this.loading.set(true);

    this.sampleService
      .updateStatus(id, SampleStatus.ACTIVE)
      .pipe(
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.loadSamples();
        },
        error: () => {
          this.error.set("Une erreur est survenue lors de la restauration.");
        },
      });
  }

  deleteForever(id: number): void {
    const confirmed = window.confirm("Supprimer définitivement ce sample ?");

    if (!confirmed) {
      return;
    }

    this.loading.set(true);

    this.sampleService
      .delete(id)
      .pipe(
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.loadSamples();
        },
        error: () => {
          this.error.set("Une erreur est survenue lors de la suppression.");
        },
      });
  }

  toggleSelection(id: number, checked: boolean): void {
    const next = new Set(this.selectedIds());

    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }

    this.selectedIds.set(next);
  }

  sortBy(column: string): void {
    if (this.sortColumn() === column) {
      this.sortDirection.update((direction) =>
        direction === "asc" ? "desc" : "asc",
      );
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set("asc");
    }

    this.loadSamples();
  }

  sortSymbol(column: string): string {
    if (this.sortColumn() !== column) {
      return "↕";
    }

    return this.sortDirection() === "asc" ? "↑" : "↓";
  }

  getSelectedIds(): number[] {
    return [...this.selectedIds()];
  }

  clearSelection(): void {
    this.selectedIds.set(new Set());
  }

  hasSelection(): boolean {
    return this.selectedIds().size > 0;
  }

  bulkRestore(): void {
    const ids = this.getSelectedIds();

    if (ids.length === 0) {
      return;
    }

    this.loading.set(true);

    this.sampleBulkService
      .bulkUpdateStatus(ids, SampleStatus.ACTIVE)
      .pipe(
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.clearSelection();
          this.loadSamples();
        },
        error: () => {
          this.error.set(
            "Une erreur est survenue lors de la restauration groupée.",
          );
        },
      });
  }

  bulkDeleteForever(): void {
    const ids = this.getSelectedIds();

    if (ids.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      `Supprimer définitivement ${ids.length} sample(s) ?`,
    );

    if (!confirmed) {
      return;
    }

    this.loading.set(true);

    this.sampleBulkService
      .bulkDelete(ids)
      .pipe(
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.clearSelection();
          this.loadSamples();
        },
        error: () => {
          this.error.set(
            "Une erreur est survenue lors de la suppression définitive.",
          );
        },
      });
  }
}
