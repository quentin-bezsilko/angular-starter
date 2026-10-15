import { Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-page-header",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./page-header.html",
  styleUrl: "./page-header.scss",
})
export class PageHeader {
  @Input({ required: true })
  title = "";

  @Input()
  description = "";

  @Input()
  backLink?: string;

  @Input()
  backLabel = "Retour";
}
