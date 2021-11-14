import { Component } from '@angular/core';
import { FirebaseService } from '../Services/firebase.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  completes: {subtitle: String, title: String, content: String}[];
  incompletes: {subtitle: String, title: String, content: String}[];

  constructor(private firestore: FirebaseService) {
    console.log(this.firestore.habitList);
    this.completes = this.firestore.habitList.complete;
    this.incompletes = this.firestore.habitList.incomplete;
  }

  toCompleteTask () {
    console.log(1);
  }

  toIncompleteTask () {
    console.log(1);
  }
}