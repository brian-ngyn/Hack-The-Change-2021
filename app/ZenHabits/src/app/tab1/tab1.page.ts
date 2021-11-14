import { DomElementSchemaRegistry } from '@angular/compiler';
import { Component } from '@angular/core';
import { FirebaseService } from '../Services/firebase.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  completes: {subtitle: any, title: any, content: any}[];
  incompletes: {subtitle: any, title: any, content: any}[];

  constructor(private firestore: FirebaseService, public toastController: ToastController) {
    this.completes = this.firestore.habitList.completes;
    this.incompletes = this.firestore.habitList.incompletes;
  }

  async toCompleteTask (incomplete, i) {
    this.firestore.habitList.completes.push({subtitle: incomplete.subtitle, title: incomplete.title, content: incomplete.content});
    this.firestore.habitList.incompletes.splice(i, 1);
    const toast = await this.toastController.create({
      message: 'Task Completed!',
      duration: 4000
    });
    toast.present();
  }

  async toIncompleteTask (complete, j) {
    this.firestore.habitList.incompletes.push({subtitle: complete.subtitle, title: complete.title, content: complete.content})
    this.firestore.habitList.completes.splice(j, 1);
    const toast = await this.toastController.create({
      message: 'Task Uncompleted!',
      duration: 4000
    });
    toast.present();
  }
}