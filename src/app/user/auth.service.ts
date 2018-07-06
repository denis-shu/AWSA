import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails, CognitoUserSession} from 'amazon-cognito-identity-js';

import { User } from './user.model';

const poolData = {
  UserPoolId: 'eu-central-1_VTtps2sd2792rsdj',
  ClientId: '1gplq2jgnsd1ur82iu40d346ht'
};
const userPool = new CognitoUserPool(poolData);

@Injectable()
export class AuthService {
  authIsLoading = new BehaviorSubject<boolean>(false);
  authDidFail = new BehaviorSubject<boolean>(false);
  authStatusChanged = new Subject<boolean>();
  registerUer:CognitoUser;

  constructor(private router: Router) {}
  
  signUp(username: string, email: string, password: string): void {
    this.authIsLoading.next(true);
    const user: User = {
      username: username,
      email: email,
      password: password
    };
    const attrList: CognitoUserAttribute[] = [];
    const emailAttribute = {
      Name: 'email',
      Value: user.email
    };
    attrList.push(new CognitoUserAttribute(emailAttribute));
    userPool.signUp(user.username, user.password, attrList, null, (err, res) => {
      if (err) {
        this.authDidFail.next(true);
        this.authIsLoading.next(false);
        return;
      }
      this.authDidFail.next(false);
      this.authIsLoading.next(false);
      this.registerUer = res.user;
    });
    return;
  }

  confirmUser(username: string, code: string) {
    this.authIsLoading.next(true);
    const userData = {
      Username: username,
      Pool:userPool
    };
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(code, true, (err, res)=>{
      if(err){
        this.authDidFail.next(true);
        this.authIsLoading.next(false);
        return; 
      }
      this.authDidFail.next(false);
      this.authIsLoading.next(false);
      this.router.navigate(['/']);
    });
  }

  //ne zab 2
  signIn(username: string, password: string): void {
    this.authIsLoading.next(true);
    const authData = {
      Username: username,
      Password: password
    };
    const authD = new AuthenticationDetails(authData);
    const userData = {
      Username: username,
      Pool: userPool
    }
    const cognitoUser = new CognitoUser(userData);
    const x = this;

    cognitoUser.authenticateUser(authD, {
      onSuccess(res: CognitoUserSession) {
        x.authStatusChanged.next(true);
        x.authDidFail.next(false);
        x.authIsLoading.next(false);
        console.log(res);
      },
      onFailure(err) {
        x.authDidFail.next(true);
        x.authIsLoading.next(false);
        console.log(err);
      }
    });
    this.authStatusChanged.next(true);
    return;
  }

  getAuthenticatedUser() {
	   return userPool.getCurrentUser();
  }

  logout() {
	   this.getAuthenticatedUser().signOut();
    this.authStatusChanged.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    const user = this.getAuthenticatedUser();
    const obs = Observable.create((observer) => {
      if (!user) {
        observer.next(false);
      } else {
         user.getSession((err, session) => {
          if (err) {
            observer.next(false);
          } else {
            if(session.isValid()){
              observer.next(true);
            }else{
              observer.next(false);
            }
          }
        });
      }
      observer.complete();
    });
    return obs;
  }
  initAuth() {
    this.isAuthenticated().subscribe(
      (auth) => this.authStatusChanged.next(auth)
    );
  }
}
