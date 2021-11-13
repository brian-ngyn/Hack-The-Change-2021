import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  habits:{subtitle: String, title: String, content: String, isChecked: Boolean}[];

  constructor() {
    this.habits = [
      {
        subtitle: "Mindfullness",
        title: "Get Outside",
        content: "Take a moment to spend some time breathing fresh air and absorbing some rays from the beautiful sun.",
        isChecked: false
      },
      {
        subtitle: "Exercise",
        title: "Walk/Run",
        content: "Get your blood flowing with some cardio",
        isChecked: false
      }

    ]
  }

}
