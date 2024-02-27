import {Component, OnInit} from '@angular/core';
import {NgForOf} from '@angular/common';
import {PageTitleComponent} from "../../shared/components/page-title/page-title.component";
import {
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonIcon,
  IonImg,
  IonRow, ModalController
} from "@ionic/angular/standalone";
import {UserPic} from "../../shared/interfaces/pics.interface";
import {MyPicsService} from "../../shared/services/my-pics/my-pics.service";
import {addIcons} from "ionicons";
import {camera} from "ionicons/icons";
import {PicPreviewComponent} from "../../shared/components/pic-preview/pic-preview.component";
import {ModalService} from "../../shared/services/modal/modal.service";

@Component({
  selector: 'app-my-pics',
  templateUrl: './my-pics.page.html',
  styleUrls: ['./my-pics.page.scss'],
  standalone: true,
  imports: [PageTitleComponent, IonContent, IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonImg, NgForOf]
})
export class MyPicsPage implements OnInit {

  pics: UserPic [] = [];

  constructor(private myPicsService: MyPicsService,
              private modalService: ModalService) {
    addIcons({camera});
  }

  async ngOnInit() {
    await this.myPicsService.loadSaved();
    this.pics = this.myPicsService.pics;
  }

  addPhotoToGallery() {
    this.myPicsService.addNewToGallery();
  }

  async showPreview(pic: UserPic, index: number) {
    this.modalService.openModal(
      {
        picPath: pic.webviewPath,
        index: index,
        isMyPic: true,
      }).then(val => {
      if (val.data) {
        this.myPicsService.deletePicture(this.pics[val.data.index], val.data.index);
      }
    });
  }
}
