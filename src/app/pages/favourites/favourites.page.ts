import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  IonContent,
  IonImg,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonTitle,
  ViewWillEnter
} from "@ionic/angular/standalone";
import {PageTitleComponent} from "../../shared/components/page-title/page-title.component";
import {IPic} from "../../shared/interfaces/pics.interface";
import {PicsService} from "../../shared/services/pics/pics.service";
import {ModalService} from "../../shared/services/modal/modal.service";

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.page.html',
  styleUrls: ['./favourites.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonTitle, PageTitleComponent, IonImg, IonInfiniteScroll, IonInfiniteScrollContent]
})
export class FavouritesPage implements ViewWillEnter {

  favouritePics: any [] = [];

  constructor(private picsService: PicsService,
              private modalService: ModalService) {
  }

  async ionViewWillEnter() {
    this.loadFavourites();
  }

  async loadFavourites() {
    await this.picsService.loadFavouritePics();
    this.favouritePics = [];
    Object.entries(this.picsService.favouritePics).forEach(entry => {
      this.favouritePics.push(entry[1]);
    });
  }

  async showPreview(pic: IPic) {
    this.modalService.openModal(
      {
        pic: pic,
        picPath: pic.src.portrait,
        isMyPic: false,
      }).then(val => {
      if (val.data && val.data.favouriteToggled) {
        this.loadFavourites();
      }
    });
  }
}
