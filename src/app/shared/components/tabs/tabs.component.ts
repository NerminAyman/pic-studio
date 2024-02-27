import { Component } from '@angular/core';
import {IonIcon, IonLabel, IonNavLink, IonTabBar, IonTabButton, IonTabs} from "@ionic/angular/standalone";
import {addIcons} from "ionicons";
import {heart, home, images, search} from "ionicons/icons";

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonLabel,
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonNavLink
  ]
})
export class TabsComponent {

  constructor() {
    addIcons({home, heart, images, search});
  }
}
