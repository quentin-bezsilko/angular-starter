import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-sample-pagination",
  standalone: true,
  templateUrl: "./sample-pagination.component.html",
  styleUrl: "./sample-pagination.component.scss",
})
export class SamplePaginationComponent {
  @Input({ required: true })
  totalElements = 0;

  @Input({ required: true })
  currentPage = 0;

  @Input({ required: true })
  totalPages = 0;

  @Output()
  previous = new EventEmitter<void>();

  @Output()
  next = new EventEmitter<void>();
}
