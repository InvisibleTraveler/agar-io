import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Router } from '@angular/router';

// servicess
import { GameService } from '../../services/game.service';

@UntilDestroy()
@Component({
  selector: 'app-guest-login',
  templateUrl: './guest-login.page.html',
  styleUrls: ['./guest-login.page.css']
})
export class GuestLoginPage {
  public name = new FormControl('', [Validators.required]);

  constructor(private router: Router, private gameService: GameService) {}

  public connectGame(): void {
    console.log('called create user');
    this.gameService.connectGame(this.name.value).pipe(untilDestroyed(this)).subscribe(() => {
      this.router.navigate(['game']);
    });
  }
}
