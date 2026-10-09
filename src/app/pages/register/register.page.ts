import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../../services/photo';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular/lazy';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage implements OnInit {
  nom: string = '';
  prenom: string = '';
  age: number | null = null;
  email: string = '';
  password: string = '';
  photoUrl: string = '';

  constructor(
    private photoService: PhotoService,
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {}

  async takePhoto() {
    const photo = await this.photoService.takePhoto();
    if (photo) {
      this.photoUrl = photo;
    }
  }

  // Soumission du formulaire
  async onRegister() {
    // Vérification des champs requis
    if (
      !this.email ||
      !this.password ||
      !this.nom ||
      !this.prenom ||
      !this.age
    ) {
      this.presentToast(
        'Veuillez remplir tous les champs obligatoires.',
        'warning',
      );
      return;
    }

    if (!this.photoUrl) {
      this.presentToast(
        'Veuillez ajouter une photo de profil via la caméra.',
        'warning',
      );
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Création du compte en cours...',
    });
    await loading.present();

    try {
      await this.authService.register(
        this.email,
        this.password,
        this.nom,
        this.prenom,
        Number(this.age),
        this.photoUrl,
      );

      await loading.dismiss();
      this.presentToast(
        'Inscription réussie ! Connexion automatique...',
        'success',
      );

      // Redirection vers les onglets principaux de l'app
      this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
    } catch (error: any) {
      await loading.dismiss();
      console.error('Erreur inscription:', error);
      this.presentToast(
        error.message || "Erreur lors de l'inscription",
        'danger',
      );
    }
  }

  // Utilitaire pour afficher des notifications (Toasts)
  private async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'bottom',
      color,
    });
    toast.present();
  }
}
