import { SizeDimension } from "../types/dimension";

/** model of an object in the game */
export abstract class GameObject {
  /** the 2d context context of the canvas on which the game object is to be drawn */
  gameContext!: CanvasRenderingContext2D;
  /** dimensions of the game window */
  gameWindow!: SizeDimension;

  constructor(canvas: HTMLCanvasElement) {
    this.gameContext = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.gameWindow = {
      height: canvas.height,
      width: canvas.width,
    };
  }

  /** code to draw the game object on the canvas */
  abstract draw(): void;

  /** code to update the config of object at each frame */
  abstract updateConfig(delta: number, webSocket?: WebSocket): void;
}
