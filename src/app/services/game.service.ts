import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

// models
import { GameState } from '../models/game-state';
import { Killer } from '../models/killer';
import { Point } from '../models/point';

// constants
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  public gameState$ = new BehaviorSubject<GameState>(null);
  public gameOver$ = new BehaviorSubject<Killer>(null);
  private socket: Socket;
  private SPEED = 1;
  private intervalKey = null;

  public connectGame(name: string): Observable<boolean> {
    this.socket = io(environment.url);

    this.socket.on('connect', res => {
      console.log(`user ${this.socket.id} connected`);

      this.socket.on('game-update', this.gameUpdate.bind(this));
      this.socket.on('game-over', this.gameOver.bind(this));

      this.socket.emit('save-name', name);
    });

    return this.gameState$.pipe(map(state => !!state), filter(c => c));
  }

  public isSocketCreated(): boolean {
    return !!this.socket;
  }

  public emitMove(center: Point, direction: Point): void {
    if (this.intervalKey) {
      clearInterval(this.intervalKey);
    }

    this.intervalKey = setInterval(() => {
      if (this.socket && !this.gameOver$.getValue()) {
        const len = this.calcLength(center, direction);
        const sin = (direction.x - center.x) / len;
        const cos = (direction.y - center.y) / len;
        this.socket.emit('move', { x: this.SPEED * sin, y: this.SPEED * cos });
      } else {
        clearInterval(this.intervalKey);
        this.intervalKey = null;
      }
    }, 30);
  }

  public disconnect(): void {
    this.socket.disconnect();
    this.socket = null;
    this.gameState$.next(null);
    this.gameOver$.next(null);
  }

  private calcLength(start: Point, end: Point): number {
    return Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
  }

  private gameUpdate(state: GameState): void {
    state.you = state.players.find(p => p.id === this.socket.id);
    this.gameState$.next(state);
  }

  private gameOver(gameOverInfo: Killer): void {
    this.gameOver$.next(gameOverInfo);
  }
}
