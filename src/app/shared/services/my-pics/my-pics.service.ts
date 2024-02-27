import {Injectable} from '@angular/core';
import {UserPic} from "../../interfaces/pics.interface";
import {Platform} from "@ionic/angular/standalone";
import {Camera, CameraResultType, CameraSource, Photo} from "@capacitor/camera";
import {Directory, Filesystem} from "@capacitor/filesystem";
import {Capacitor} from "@capacitor/core";
import {Preferences} from "@capacitor/preferences";

@Injectable({
  providedIn: 'root'
})
export class MyPicsService {

  public pics: UserPic[] = [];
  private MY_PIC_STORAGE: string = 'my_pics';
  private platform: Platform;

  constructor(platform: Platform) {
    this.platform = platform;
  }

  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  private async readAsBase64(photo: Photo) {
    if (this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path!
      });
      return file.data;
    } else {
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();
      return await this.convertBlobToBase64(blob) as string;
    }
  }

  private async savePicture(photo: Photo) {
    const base64Data = await this.readAsBase64(photo);
    const fileName = Date.now() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });
    if (this.platform.is('hybrid')) {
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    } else {
      return {
        filepath: fileName,
        webviewPath: photo.webPath
      };
    }
  }

  async addNewToGallery() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    const savedImageFile = await this.savePicture(capturedPhoto);
    this.pics.unshift(savedImageFile);

    await Preferences.set({
      key: this.MY_PIC_STORAGE,
      value: JSON.stringify(this.pics),
    });
  }

  public async loadSaved() {
    const {value} = await Preferences.get({key: this.MY_PIC_STORAGE});
    this.pics = (value ? JSON.parse(value) : []) as UserPic[];

    if (!this.platform.is('hybrid')) {
      for (let photo of this.pics) {
        const readFile = await Filesystem.readFile({
          path: photo.filepath,
          directory: Directory.Data
        });
        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    }
  }

  async deletePicture(photo: UserPic, index: number) {
    this.pics.splice(index, 1);

    Preferences.set({
      key: this.MY_PIC_STORAGE,
      value: JSON.stringify(this.pics)
    });

    const filename = photo.filepath
      .substr(photo.filepath.lastIndexOf('/') + 1);

    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data
    });
  }
}
