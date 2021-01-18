import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject } from 'rxjs';
import { auditTime, filter, map } from 'rxjs/operators';

// models
import { GameState } from '../../models/game-state';
import { Point } from '../../models/point';

@UntilDestroy()
@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.css']
})
export class GamePage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('playField') public canvasRef: ElementRef<HTMLCanvasElement>;
  private resizeHandler = null;
  // public gameOver$ = this.gameService.gameOver$;
  // public coords$ = this.gameService.gameState$.pipe(map(state => state.you));
  private move$ = new BehaviorSubject<Point[]>(null);

  constructor(private changeDetection: ChangeDetectorRef) {}

  public ngOnInit(): void {
    this.resizeHandler = this.handleResize.bind(this);

    window.addEventListener('resize', this.resizeHandler);
  }

  public ngAfterViewInit(): void {
    this.resizeHandler();

    // this.move$.pipe(auditTime(30), filter(m => !!m), untilDestroyed(this)).subscribe(direction => {
    //   this.gameService.emitMove(direction[0], direction[1]);
    // });

    // this.gameService.gameState$.pipe(untilDestroyed(this)).subscribe(state => {
    //   this.draw(state);
    // });

    this.changeDetection.detectChanges();
  }

  public ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeHandler);
    this.resizeHandler = null;
    // this.gameService.disconnect();
  }

  private handleResize(): void {
    const canvas = this.canvasRef.nativeElement;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  public handleMove(e: MouseEvent): void {
    const canvas = this.canvasRef.nativeElement;
    const center = { x: canvas.width / 2, y: canvas.height / 2 };
    const mouse = { x: e.offsetX, y: e.offsetY };
    this.move$.next([center, mouse]);
  }

  private draw(state: GameState): void {
    if (state.you === null) {
      state.you = { x: state.roomSize / 2, y: state.roomSize / 2 } as any;
    }

    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d');

    context.clearRect(-10, -10, canvas.width + 20, canvas.height + 20);

    const zoom = canvas.height / 20 / (state.you.r || 2);

    const xOffset = state.you.x * zoom - canvas.width / 2;
    const yOffset = state.you.y * zoom - canvas.height / 2;

    context.fillStyle = 'green';
    state.food.forEach(f => {
      const [realX, realY] = [f.x * zoom - xOffset, f.y * zoom - yOffset];
      context.moveTo(realX, realY);
      context.beginPath();
      context.arc(realX, realY, zoom, 0, 2 * Math.PI);
      context.fill();
    });

    state.players.forEach(p => {
      context.fillStyle = p.color;
      const [realX, realY] = [p.x * zoom - xOffset, p.y * zoom - yOffset];
      const realR = p.r * zoom;
      context.moveTo(realX, realY);
      context.beginPath();
      context.arc(realX, realY, realR, 0, 2 * Math.PI);
      context.fill();
      context.fillStyle = 'black';
      context.textAlign = 'center';
      context.font = `${Math.ceil(realR / 2)}px serif`;
      context.fillText(p.name, realX, realY);
    });
  }
}
