import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {IPic} from "../../interfaces/pics.interface";
import {Preferences} from "@capacitor/preferences";
import {Directory, Filesystem} from "@capacitor/filesystem";
import {ToastController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class PicsService {

  public favouritePics: any = {};
  private FAVOURITE_PIC_STORAGE: string = 'favourite_pics';

  constructor(private httpClient: HttpClient, private toastController: ToastController) {
  }

  getPics(pageIndex: number, keyword: string): Promise<any> {
    if (keyword) {
      return this.searchInPicsPaginated(pageIndex, keyword);
    } else {
      return this.getPicsPaginated(pageIndex);
    }
  }

  getPicsPaginated(pageIndex: number): Promise<any> {
    return new Promise((resolve, reject) => {
      firstValueFrom(this.httpClient.get(`https://api.pexels.com/v1/curated?page=${pageIndex}&per_page=10`))
        .then((res) => {
          resolve(res);
        }).catch(err => {
        reject(err);
      })
    });
  }

  searchInPicsPaginated(pageIndex: number, keyword: string): Promise<any> {
    return new Promise((resolve, reject) => {
      firstValueFrom(this.httpClient.get(`https://api.pexels.com/v1/search?query=${keyword ? keyword : ''}&page=${pageIndex}&per_page=10`))
        .then((res) => {
          resolve(res);
        }).catch(err => {
        reject(err);
      })
    });
  }

  public async loadFavouritePics() {
    const {value} = await Preferences.get({key: this.FAVOURITE_PIC_STORAGE});
    this.favouritePics = (value ? JSON.parse(value) : {}) as any;
  }

  async toggleFavourite(pic: IPic, isAdd: boolean) {
    if (isAdd) {
      this.favouritePics[pic.id] = pic;
    } else {
      delete this.favouritePics[pic.id];
    }
    await Preferences.set({
      key: this.FAVOURITE_PIC_STORAGE,
      value: JSON.stringify(this.favouritePics),
    });
    this.loadFavouritePics();
  }

  checkStoragePermission() {
    return new Promise((resolve, reject) => {
      Filesystem.checkPermissions().then(value => {
        if (value.publicStorage === 'granted') {
          resolve(true);
        } else {
          reject();
        }
      }).catch(() => {
        Filesystem.requestPermissions().then(value => {
          if (value.publicStorage === 'granted') {
            resolve(true);
          } else {
            reject();
          }
        }).catch(() => {
          reject();
        })
      })
    })
  }

  downloadPic(imageLink: string, name: string) {
    this.checkStoragePermission().then(() => {
      Filesystem.downloadFile({
        url: imageLink,
        path: `${name}.jpeg`,
        directory: Directory.Documents,
      }).then(value => {
        this.presentAlert(`Image has been downloaded to '${value.path}'`)
      }).catch(() => {
        this.presentAlert(`Image failed to download kindly try again later`)
      })
    }).catch(() => {
      this.presentAlert('Kindly change permissions from settings')
    })
  }

  async presentAlert(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      buttons: [
        {
          text: 'Dismiss',
          role: 'cancel',
        },
      ]
    });
    await toast.present();
  }

}
