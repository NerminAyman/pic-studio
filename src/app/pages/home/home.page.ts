import {Component, OnInit} from '@angular/core';
import {
  IonContent,
  IonHeader, IonIcon,
  IonImg,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonTitle,
  IonToolbar, ModalController
} from '@ionic/angular/standalone';
import {PageTitleComponent} from "../../shared/components/page-title/page-title.component";
import {IPic} from "../../shared/interfaces/pics.interface";
import {PicsService} from "../../shared/services/pics/pics.service";
import {InfiniteScrollCustomEvent} from "@ionic/angular/standalone";
import {NgForOf, NgIf} from "@angular/common";
import {PicPreviewComponent} from "../../shared/components/pic-preview/pic-preview.component";
import {ModalService} from "../../shared/services/modal/modal.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, PageTitleComponent, IonImg, IonInfiniteScroll, IonInfiniteScrollContent, NgForOf, NgIf, IonIcon],
})
export class HomePage implements OnInit {

  pics: IPic [] = [];
  currentPage: number = 1;
  keyword: string = '';
  totalLoadedItems: number = 10;
  totalItems: number = 0
  canLoadMore: boolean = true;

  constructor(private picsService: PicsService,
              private modalService: ModalService) {
  }

  ngOnInit(): void {
    this.loadPics(this.currentPage, this.keyword, false);
    this.picsService.loadFavouritePics();
  }

  loadPics(pageIndex: number, keyword: string, isLoadMore: boolean) {
    this.picsService.getPics(pageIndex, keyword)
      .then(res => {
        if (isLoadMore) {
          this.pics = [...this.pics, ...res.photos];
          this.totalLoadedItems += 10;
        } else {
          this.pics = res.photos;
        }
        this.totalItems = res.total_results;
      })
  }

  loadMorePics($event: InfiniteScrollCustomEvent) {
    if (this.totalLoadedItems < this.totalItems) {
      this.currentPage++;
      this.loadPics(this.currentPage, this.keyword, true);
      setTimeout(() => {
        ($event as InfiniteScrollCustomEvent).target.complete();
      }, 500);
    } else {
      this.canLoadMore = false;
    }
  };

  async showPreview(pic: IPic) {
    this.modalService.openModal(
      {
        pic: pic,
        picPath: pic.src.portrait,
        isMyPic: false,
      }
    );
  }
}
