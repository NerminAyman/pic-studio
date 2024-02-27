import {Component} from '@angular/core';
import {
  IonApp,
  IonRouterOutlet
} from '@ionic/angular/standalone';
import {TabsComponent} from "./shared/components/tabs/tabs.component";
import {defineCustomElements} from "@ionic/pwa-elements/loader";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, TabsComponent],
})
export class AppComponent{

  constructor() {
    defineCustomElements(window)
  }
}
