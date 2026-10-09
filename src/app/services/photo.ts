import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  constructor() {}

  // Méthode pour déclencher la caméra du téléphone ou la galerie
  async takePhoto(): Promise<string | undefined> {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Base64, // Récupère la photo sous forme de texte Base64
        source: CameraSource.Prompt, // Propose le choix entre Appareil photo et Galerie
      });

      if (image.base64String) {
        // Formatage pour l'afficher directement dans une balise <ion-img [src]="... ">
        return `data:image/jpeg;base64,${image.base64String}`;
      }
      return undefined;
    } catch (error) {
      console.log('Capture annulée ou indisponible :', error);
      return undefined;
    }
  }
}
