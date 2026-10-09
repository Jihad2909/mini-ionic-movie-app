import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular/lazy';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {}

  async onLogin() {
    if (!this.email || !this.password) {
      this.presentToast(
        "Veuillez remplir l'email et le mot de passe.",
        'warning',
      );
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Connexion en cours...',
    });
    await loading.present();

    try {
      await this.authService.login(this.email, this.password);
      await loading.dismiss();

      this.presentToast('Connexion réussie !', 'success');
      this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
    } catch (error: any) {
      await loading.dismiss();
      console.error('Erreur connexion:', error);

      let message = 'Identifiants incorrects ou problème réseau.';
      if (error.message && error.message.includes('désactivé')) {
        message = error.message;
      }

      this.presentToast(message, 'danger');
    }
  }

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
