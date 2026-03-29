import { Component } from '@angular/core';
import {
  NgccButton,
  NgccHeader,
  NgccHeaderName,
  NgccHeaderNavigation,
  NgccHeaderItem,
  NgccHeaderGlobal,
  NgccHamburger,
  NgccAccordion,
  NgccAccordionItem,
} from '@assistanz/carbideui';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgccButton,
    NgccHeader,
    NgccHeaderName,
    NgccHeaderNavigation,
    NgccHeaderItem,
    NgccHeaderGlobal,
    NgccHamburger,
    NgccAccordion,
    NgccAccordionItem,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {}
