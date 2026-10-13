import type { OnInit } from "@angular/core";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  computed,
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { debounceTime, distinctUntilChanged, finalize, Subject } from "rxjs";
import type { ImportResult, Sample } from "../../model/sample.model";
import { SampleStatus } from "../../model/sample.model";
import { SampleService } from "../../service/sample.service";
import { SampleBulkService } from "../../service/sample-bulk.service";
import { AuthService } from "../../../auth/auth.service";

type SortDirection = "asc" | "desc";

@Component({
  selector: "app-sample-list",
  standalone: true,
  imports: [RouterLink, DatePipe, FormsModule],
  templateUrl: "./sample-list.component.html",
  styleUrl: "./sample-list.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SampleListComponent implements OnInit {
  private readonly sampleService = inject(SampleService);
  private readonly sampleBulkService = inject(SampleBulkService);

  readonly samples = signal<Sample[]>([]);
  readonly selectedIds = signal<Set<number>>(new Set());
  readonly selectedCount = computed(() => this.selectedIds().size);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly totalElements = signal(0);
  readonly totalPages = signal(0);
  readonly currentPage = signal(0);
  readonly pageSize = signal(8);

  private readonly searchSubject = new Subject<string>();

  readonly search = signal("");
  readonly statusFilter = signal<SampleStatus | "">("");
  readonly categoryFilter = signal("");
  readonly activeFilter = signal<boolean | undefined>(undefined);

  readonly sortColumn = signal("id");
  readonly sortDirection = signal<SortDirection>("desc");

  readonly SampleStatus = SampleStatus;

  readonly statuses = Object.values(SampleStatus);

  private readonly authService = inject(AuthService);
  readonly canRead = this.authService.canRead;
  readonly canWrite = this.authService.canWrite;

  importResult?: ImportResult;
  showImportResult = false;

  ngOnInit(): void {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((search) => {
        this.search.set(search);
        this.loadSamples(0);
      });

    this.loadSamples();
  }

  onSearchChange(value: string): void {
    this.searchSubject.next(value.trim());
  }

  loadSamples(page = this.currentPage()): void {
    this.loading.set(true);
    this.error.set(null);

    const sort = `${this.sortColumn()},${this.sortDirection()}`;
    const filters = this.getFilters();
    this.sampleService
      .findAll(
        page,
        this.pageSize(),
        sort,
        filters.search,
        filters.status,
        filters.category,
        filters.active,
      )
      .pipe(
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: (response) => {
          this.samples.set(response.content);
          this.currentPage.set(response.number);
          this.pageSize.set(response.size);
          this.totalPages.set(response.totalPages);
          this.totalElements.set(response.totalElements);
        },
        error: () => {
          this.error.set(
            "Une erreur est survenue lors du chargement des samples.",
          );
        },
      });
  }

  duplicate(id: number): void {
    this.loading.set(true);

    this.sampleService
      .duplicate(id)
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
          this.error.set(
            "Une erreur est survenue lors de la duplication du sample.",
          );
        },
      });
  }

  delete(id: number): void {
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer ce sample ?",
    );

    if (!confirmed) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

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
          this.error.set(
            "Une erreur est survenue lors de la suppression du sample.",
          );
        },
      });
  }

  exportExcel(): void {
    this.loading.set(true);
    this.error.set(null);

    const filters = this.getFilters();

    this.sampleService
      .export(filters.search, filters.status, filters.category, filters.active)
      .pipe(
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;

          const date = new Date().toISOString().split("T")[0];

          link.download = `samples-${date}.xlsx`;

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          window.URL.revokeObjectURL(url);
        },
        error: () => {
          this.error.set(
            "Une erreur est survenue lors de l’export des samples.",
          );
        },
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];

    this.sampleService.importSamples(file).subscribe({
      next: (result) => {
        this.importResult = result;
        this.showImportResult = true;
        this.loadSamples();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  private getFilters() {
    return {
      search: this.search() || undefined,
      status: this.statusFilter() || undefined,
      category: this.categoryFilter() || undefined,
      active: this.activeFilter(),
    };
  }

  applyFilters(): void {
    this.loadSamples(0);
  }

  resetFilters(): void {
    this.search.set("");
    this.statusFilter.set("");
    this.categoryFilter.set("");
    this.activeFilter.set(undefined);

    this.loadSamples(0);
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

    this.loadSamples(0);
  }

  sortSymbol(column: string): string {
    if (this.sortColumn() !== column) {
      return "↕";
    }

    return this.sortDirection() === "asc" ? "↑" : "↓";
  }

  previousPage(): void {
    if (this.currentPage() > 0) {
      this.loadSamples(this.currentPage() - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() + 1 < this.totalPages()) {
      this.loadSamples(this.currentPage() + 1);
    }
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
        return "Supprimé";
    }
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

  isSelected(id: number): boolean {
    return this.selectedIds().has(id);
  }

  toggleAll(checked: boolean): void {
    const next = new Set(this.selectedIds());
    if (checked) {
      this.samples().forEach((sample) => {
        next.add(sample.id);
      });
    } else {
      this.samples().forEach((sample) => {
        next.delete(sample.id);
      });
    }
    this.selectedIds.set(next);
  }

  areAllSelected(): boolean {
    const samples = this.samples();
    return (
      samples.length > 0 &&
      samples.every((sample) => this.selectedIds().has(sample.id))
    );
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

  bulkDelete(): void {
    const ids = this.getSelectedIds();
    if (ids.length === 0) {
      return;
    }
    const confirmed = window.confirm(`Supprimer ${ids.length} sample(s) ?`);

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
            "Une erreur est survenue lors de la suppression groupée.",
          );
        },
      });
  }

  bulkDuplicate(): void {
    const ids = this.getSelectedIds();

    if (ids.length === 0) {
      return;
    }

    this.loading.set(true);

    this.sampleBulkService
      .bulkDuplicate(ids)
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
            "Une erreur est survenue lors de la duplication groupée.",
          );
        },
      });
  }

  bulkExport(): void {
    const ids = this.getSelectedIds();

    if (ids.length === 0) {
      return;
    }

    this.loading.set(true);

    this.sampleBulkService
      .bulkExport(ids)
      .pipe(
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = url;

          const date = new Date().toISOString().split("T")[0];

          link.download = `samples-selection-${date}.xlsx`;

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          window.URL.revokeObjectURL(url);
        },
        error: () => {
          this.error.set("Une erreur est survenue lors de l’export groupé.");
        },
      });
  }

  bulkUpdateStatus(status: SampleStatus): void {
    const ids = this.getSelectedIds();

    if (ids.length === 0) {
      return;
    }

    this.loading.set(true);

    this.sampleBulkService
      .bulkUpdateStatus(ids, status)
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
            "Une erreur est survenue lors de la mise à jour groupée.",
          );
        },
      });
  }
}
