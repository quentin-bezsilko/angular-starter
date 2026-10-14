import { Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";

import { Sample } from "../../model/sample.model";

@Component({
  selector: "app-sample-favorite-card",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./sample-favorite-card.component.html",
  styleUrl: "./sample-favorite-card.component.scss",
})
export class SampleFavoriteCardComponent {
  @Input({ required: true })
  sample!: Sample;
}