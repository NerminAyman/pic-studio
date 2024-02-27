import {Injectable} from '@angular/core';
import {PicPreviewComponent} from "../../components/pic-preview/pic-preview.component";
import {ModalController} from "@ionic/angular/standalone";

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private modalController: ModalController) {
  }

  async openModal(modalProps: any) {
    const modal = await this.modalController.create({
      component: PicPreviewComponent,
      componentProps: modalProps,
    });
    modal.present();
    const {data, role} = await modal.onWillDismiss();
    return {data, role};
  }
}
