import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment, firebaseConfig } from 'src/environments/environment';
import { BehaviorSubject, from, of } from 'rxjs';
import { User } from './user.model';
import { map, switchMap, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';
//import { IonicStorageService } from '../Services/ionic-storage.service';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;   //Optional because this property is used only for Login.
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user = new BehaviorSubject<User>(null); //Initialized with null.

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(map(user =>{
      if(user){
        return !!user.token; //Two exclamation marks are added to convert the token to boolean.
      }
      else {
        return false;
      }
    })); 
  }
  
  get userId() {
    return this._user.asObservable().pipe(map(user => {
      if(user) { 
        console.log(user.id);
        return user.id 
      }
    else return null;}));
  }

  constructor(private http: HttpClient, private fireStore: AngularFirestore, private alertController: AlertController) { }

  signup( email: string, password: string, confirmpassword: string){
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseConfig.apiKey}`,
    {email: email, password: password, confirmpassword: confirmpassword, returnSecureToken: true }).pipe(tap(this.setUserData.bind(this)));
  }

  login(email: string, password: string) { 
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`,
      { email: email, password: password, returnSecureToken: true }
    ).pipe(tap(this.setUserData.bind(this)));
  }

  logout(){
    this._user.next(null); 
    // this.storageService.clear();
  }

  private setUserData(userData: AuthResponseData) {
    //Date object that marks the expiration of the token.
    const expirationTime = new Date(
      new Date().getTime() + +userData.expiresIn * 1000 //Conversion to seconds.
    );
    this._user.next(
      //Creating a new user and retrieving the user data.
      new User(
        userData.localId,
        userData.email,
        userData.idToken,
        expirationTime
      )
    );
    this.storeAuthData(userData.localId, userData.idToken, userData.email, expirationTime.toISOString());
    console.log(this._user.value)
  }

  private storeAuthData(localId: string, idToken: string, email: string, tokenExpirationDate: string) {
    //this.storageService.set('authData', { localId: localId, idToken: idToken, email: email, tokenExpirationDate: tokenExpirationDate });
  }

  async presentNoBackendSetupError() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Unable to find any Hydrotek devices registered to this account.',
      buttons: ['OK']
    });
    await alert.present();
  }
}
