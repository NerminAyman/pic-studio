import {Component, OnInit} from '@angular/core';
import {IPic} from "../../interfaces/pics.interface";
import {
  ActionSheetController,
  IonBackButton,
  IonButtons,
  IonHeader, IonIcon,
  IonImg,
  IonToolbar, ModalController
} from "@ionic/angular/standalone";
import {addIcons} from "ionicons";
import {arrowBack, camera, close, download, heart, heartOutline, trash} from "ionicons/icons";
import {NgIf} from "@angular/common";
import {PicsService} from "../../services/pics/pics.service";

@Component({
  selector: 'app-pic-preview',
  templateUrl: './pic-preview.component.html',
  styleUrls: ['./pic-preview.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonImg,
    IonIcon,
    NgIf
  ]
})
export class PicPreviewComponent implements OnInit {

  pic: IPic = {
    alt: '',
    id: 0,
    src: {portrait: ''},
    filepath: '',
    webviewPath: '',
  };
  picPath: string = '';
  index: number = 0;
  isMyPic: boolean = false;
  isFavourite: boolean = false;
  favouriteToggled: boolean = false;

  constructor(private actionSheetController: ActionSheetController,
              private modalController: ModalController,
              private picsService: PicsService) {
    addIcons({camera, trash, close, arrowBack, heart, download, heartOutline});
  }

  ngOnInit(): void {
    this.isFavourite = !!(this.picsService.favouritePics[this.pic.id]);
  }

  async showActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Are you sure you want to delete this pic ?',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.closePreview(this.index);
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
          }
        }]
    });
    await actionSheet.present();
  }

  closePreview(index?: number) {
    if (index || index == 0) {
      this.modalController.dismiss({
        index: this.index
      });
    } else {
      if (this.favouriteToggled) {
        this.modalController.dismiss({
          favouriteToggled: true
        });
      } else {
        this.modalController.dismiss();
      }
    }
  }

  toggleFavourite(pic: IPic, isAdd: boolean) {
    this.favouriteToggled = true;
    this.picsService.toggleFavourite(pic, isAdd);
    this.isFavourite = isAdd;
  }

  downloadPic(picPath: string, name: string) {
    this.picsService.downloadPic(picPath, name);
  }

}
