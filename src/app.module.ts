import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { SignupComponent } from './user/signup/signup.component';
import { SigninComponent } from './user/signin/signin.component';
import { ActionComponent } from './action/action.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './user/auth.service';
import { ActionService } from './action/action.service';
import { ActionInputComponent } from './action/action-input/action-input.component';
import { ActionResultsComponent } from './action/action-results/action-results.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent,
    ActionComponent,
    ActionInputComponent,
    ActionResultsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [AuthService, ActionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
