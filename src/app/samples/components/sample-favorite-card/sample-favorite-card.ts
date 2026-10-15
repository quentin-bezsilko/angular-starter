import { Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";

import type { Sample } from "../../model/sample";

@Component({
  selector: "app-sample-favorite-card",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./sample-favorite-card.html",
  styleUrl: "./sample-favorite-card.scss",
})
export class SampleFavoriteCard {
  @Input({ required: true })
  sample!: Sample;
}
