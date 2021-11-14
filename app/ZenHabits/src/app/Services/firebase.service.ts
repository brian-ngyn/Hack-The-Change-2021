import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  itemsCollection: AngularFirestoreCollection<any>;
  taskStatusDocument: AngularFirestoreDocument<any>;
  tipOfTheDayCollection: AngularFirestoreCollection<any>;
  userID: string;
  public habitList: {completes: {content: any, subtitle: any, title: any}[], incompletes: {content: any, subtitle: any, title: any}[]} = {
    completes: [],
    incompletes: []
  }
  public tipsList=[];
  taskList: any;

  constructor(private firestore: AngularFirestore, private authService: AuthService) { }

  getHabits() {
    this.itemsCollection = this.firestore.collection<any>('Habits');
    return this.authService.userId.pipe(take(1), switchMap((id) => { 
      var x;
      return this.firestore.doc<any>('Users/' + id).valueChanges().pipe(switchMap(data => {
        x = data;
        return this.itemsCollection.valueChanges().pipe(tap((data) => {
          data.forEach(habit => {
            var status;
            status = x[habit.title];
            let arr = status ? this.habitList.completes : this.habitList.incompletes;
            arr.push(habit);
          });
        }));
      }));
    }));
  }

  getTips() {
    this.firestore.collection("Tip of the Day").snapshotChanges().subscribe((data2) => {
      this.tipsList = data2.map(e => {
        return { tips: e.payload.doc.data()["tip"]}
      })
    })
  }
}