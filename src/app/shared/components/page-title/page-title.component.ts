import {Component, Input} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss'],
  standalone: true,
  imports: [
    NgIf
  ]
})
export class PageTitleComponent {

  @Input() title: string = '';

  constructor() {
  }
}
