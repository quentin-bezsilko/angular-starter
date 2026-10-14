import type { OnInit } from "@angular/core";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { PageHeaderComponent } from "../../components/page-header/page-header.component";
import { finalize } from "rxjs";

import type { Sample } from "../../model/sample.model";
import { SampleService } from "../../service/sample.service";
import { SampleFavoriteCardComponent } from "../../components/sample-favorite-card/sample-favorite-card.component";

@Component({
  selector: "app-sample-favorites",
  standalone: true,
  imports: [PageHeaderComponent, SampleFavoriteCardComponent],
  templateUrl: "./sample-favorites.component.html",
  styleUrl: "./sample-favorites.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SampleFavoritesComponent implements OnInit {
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
