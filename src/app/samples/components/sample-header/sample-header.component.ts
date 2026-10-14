import { Component, ChangeDetectionStrategy } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-sample-header",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./sample-header.component.html",
  styleUrl: "./sample-header.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SampleHeaderComponent {}
