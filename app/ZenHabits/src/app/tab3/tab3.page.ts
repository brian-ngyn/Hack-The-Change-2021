import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})

export class Tab3Page {

  constructor(private router : Router, public alertController: AlertController) {

  }

  async navigateAuthPage() {
    const alert = await this.alertController.create({
      header: 'We hope to see you again soon!',
      buttons: ['You will!']
    });
    await alert.present();
    this.router.navigateByUrl('/auth');
  }
}
