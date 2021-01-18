import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// pages
import { GuestLoginPage } from './pages/guest-login/guest-login.page';
import { GamePage } from './pages/game/game.page';

const routes: Routes = [
  {
    path: 'guest-login',
    component: GuestLoginPage
  },
  {
    path: 'game',
    component: GamePage
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'guest-login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule {}
