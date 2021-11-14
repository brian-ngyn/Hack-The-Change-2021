import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { FirebaseService } from '../Services/firebase.service';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  formgroup: FormGroup;
  
  isLoading = false; //set to false as a default.
  isLogin = true; //set to true as a default.
  //Parameters injected to trigger the necessary methods.
  constructor(private firestore: FirebaseService, private authService: AuthService, private router : Router, private loadingCtrl: LoadingController, public formbuilder: FormBuilder, private alertCtrl: AlertController) {  
    this.formgroup = this.formbuilder.group(
      {
        email: new FormControl('', Validators.compose([Validators.required, Validators.email])), 
        password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)]))
      }
    );
   }

  ngOnInit() {}

  onSubmit(){
    if(!this.formgroup.valid) {
      return;
    }
    //If the form is valid, the email and password properties are extracted.
    const email = this.formgroup.value['email'];
    const password = this.formgroup.value['password'];
    this.onLogin(email, password);
  }

  onLogin(email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then(loadingEl => {
        loadingEl.present();
        //To fetch the AuthResponseData asynchronously, Observable is used here.
        let authObs: Observable<AuthResponseData>;  
        if (this.isLogin) {
          authObs = this.authService.login(email, password);
        }
        //Data is fetched when subscriber function is executed.
        authObs.subscribe(authResData => {
            this.isLoading = false;
            loadingEl.dismiss();
            console.log('Logged in!');
            console.log(this.firestore.getTips());
            this.firestore.getHabits().subscribe(() => {
              this.router.navigateByUrl('/tabs/tab2');
            });
          },
          //In case of errors while logging in, custom error messages are displayed.
          errRes => {
            loadingEl.dismiss();
            console.log(errRes);  
            const code = errRes.error.error.message;
            let message = 'Could not log you in. Try again.';
             if (code === 'EMAIL_NOT_FOUND') {
              message = 'E-Mail address could not be found.';
            } else if (code === 'INVALID_PASSWORD') {
              message = 'This password is not correct.';
            }
            this.showAlert(message);
          }
        );
      });
  }

  //Alert box display function.
  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Authentication failed',
        message: message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }
 
  //Navigated to the Signup Page when Sign Up option is selected.
  signUp() {
    this.router.navigateByUrl('/register')
  }  
}
