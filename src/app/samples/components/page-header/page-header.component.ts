import { Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-page-header",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./page-header.component.html",
  styleUrl: "./page-header.component.scss",
})
export class PageHeaderComponent {
  @Input({ required: true })
  title = "";

  @Input()
  description = "";

  @Input()
  backLink?: string;

  @Input()
  backLabel = "Retour";
}