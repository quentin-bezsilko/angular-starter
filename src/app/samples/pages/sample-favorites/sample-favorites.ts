import type { OnInit } from "@angular/core";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { PageHeader } from "../../components/page-header/page-header";
import { finalize } from "rxjs";

import type { Sample } from "../../model/sample";
import { SampleService } from "../../service/sample-service";
import { SampleFavoriteCard } from "../../components/sample-favorite-card/sample-favorite-card";

@Component({
  selector: "app-sample-favorites",
  standalone: true,
  imports: [PageHeader, SampleFavoriteCard],
  templateUrl: "./sample-favorites.html",
  styleUrl: "./sample-favorites.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SampleFavorites implements OnInit {
  private readonly sampleService = inject(SampleService);

  readonly samples = signal<Sample[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.loading.set(true);
    this.error.set(null);

    this.sampleService
      .findAll(0, 100, "name,asc", undefined, undefined, undefined, undefined)
      .pipe(
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: (response) => {
          this.samples.set(
            response.content.filter((sample) => sample.favorite),
          );
        },
        error: () => {
          this.error.set("Impossible de charger les favoris.");
        },
      });
  }
}
