import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// modules
import { AppRoutingModule } from './app-routing.module';

// components
import { AppComponent } from './app.component';

// pages
import { GuestLoginPage } from './pages/guest-login/guest-login.page';
import { GamePage } from './pages/game/game.page';

@NgModule({
  declarations: [
    AppComponent,
    GuestLoginPage,
    GamePage
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
