import {Component, OnInit} from '@angular/core';
import {
  InfiniteScrollCustomEvent, IonBackButton,
  IonButton, IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonInput,
  IonTitle, IonToolbar,
} from '@ionic/angular/standalone';
import {PageTitleComponent} from "../../shared/components/page-title/page-title.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {IPic} from "../../shared/interfaces/pics.interface";
import {PicsService} from "../../shared/services/pics/pics.service";
import {NgForOf, NgIf} from "@angular/common";
import {addIcons} from "ionicons";
import {search, arrowBack} from "ionicons/icons";
import {Keyboard} from "@capacitor/keyboard";
import {ModalService} from "../../shared/services/modal/modal.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [IonContent, PageTitleComponent, IonInput, IonImg, IonInfiniteScroll, IonInfiniteScrollContent, NgForOf, NgIf, ReactiveFormsModule, IonIcon, IonButton, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons]
})
export class SearchPage implements OnInit {

  searchCtrl: FormControl = new FormControl<any>('');
  pics: IPic [] = [];
  currentPage: number = 1;
  keyword: string = '';
  totalLoadedItems: number = 10;
  totalItems: number = 0
  canLoadMore: boolean = true;

  constructor(private picsService: PicsService,
              private modalService: ModalService) {
    addIcons({search, arrowBack})
  }

  ngOnInit(): void {
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

  search() {
    Keyboard.hide();
    this.currentPage = 1;
    this.totalLoadedItems = 10;
    this.canLoadMore = true;
    this.keyword = this.searchCtrl.value;
    console.log(this.keyword);
    this.loadPics(this.currentPage, this.searchCtrl.value, false);
  }

  async showPreview(pic: IPic) {
    this.modalService.openModal({
      pic: pic,
      picPath: pic.src.portrait,
      isMyPic: false,
    })
  }
}
