import { Point } from './point';
import { Player } from './player';

export interface GameState {
  you?: Player;
  food: Point[];
  players: Player[];
  roomSize: number;
}
