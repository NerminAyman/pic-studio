import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  IonApp,
  IonRouterOutlet
} from '@ionic/angular/standalone';
import {TabsComponent} from "./shared/components/tabs/tabs.component";
import {defineCustomElements} from "@ionic/pwa-elements/loader";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, TabsComponent],
})
export class AppComponent{

  isSearchPage: boolean = false;
  subscriptions: Subscription [] = [];

  constructor(private route: Router) {
    defineCustomElements(window)
  }
}
