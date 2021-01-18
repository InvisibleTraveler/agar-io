import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

// services
import { GameService } from '../services/game.service';

@Injectable({
  providedIn: 'root'
})
export class GameGuard implements CanActivate {
  constructor(private router: Router, private gameService: GameService) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    return this.gameService.isSocketCreated() || this.router.createUrlTree(['guest-login']);
  }
}
