import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../Services/firebase.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  date: string;
  tips: any;
  randomNumber: any;
  tipToHTML: string;

  constructor(private router : Router, private firestore: FirebaseService) {
    this.date = new Date().toDateString()
    console.log(this.firestore.tipsList);
    this.randomNumber = Math.floor(Math.random() * (this.firestore.tipsList.length) + 1);
    this.tipToHTML = this.firestore.tipsList[this.randomNumber].tips;
  }

  navigateResources() {
    this.router.navigateByUrl('/resources')
  }
}
