import { PositionDimension } from "../types/dimension";
import { Position } from "../types/position";
import { GameObject } from "./game-object";

export class Paddle extends GameObject {
  /** horizontal size of the paddle */
  paddleWidth!: number;
  /** vertical size of the paddle */
  paddleHeight!: number;

  /** how much the position of paddle should be displaced on each frame (max speed of the paddle) */
  movementSpeed!: number;

  /** the speed at which paddle is moving */
  currentSpeed = 0;

  /** which side of the window the paddle should be displayed */
  paddlePosition!: Position;
  /** whether the paddle should move horizontall yor vertically */
  movementDirection!: "vertical" | "horizontal";

  /** the space between paddle and game window's boundary */
  distanceFromBoundary!: number;

  /** calculates and returns the position coordinates for the paddle */
  paddlePositionCoordinates!: PositionDimension;

  /** color of the paddle */
  fillColor!: string;
  /** border color of the paddle */
  strokeColor!: string;
  /** border width of the paddle */
  strokeWidth!: number;

  paddleIndex!: number;

  /** actual horizontal size of the paddle based on position of the paddle  */
  get _paddleWidth(): number {
    return this.movementDirection === "vertical"
      ? this.paddleHeight
      : this.paddleWidth;
  }

  /** actual vertical size of the paddle based on position of the paddle  */
  get _paddleHeight(): number {
    return this.movementDirection === "horizontal"
      ? this.paddleHeight
      : this.paddleWidth;
  }

  constructor(
    canvas: HTMLCanvasElement,
    paddleWidth: number,
    paddleHeight: number,
    paddlePosition: Position = "bottom",
    movementSpeed: number = 45,
    fillColor = "#bbb",
    strokeColor = "#000",
    strokeWidth = 1,
    distanceFromBoundary: number = 15
  ) {
    super(canvas);

    this.paddleWidth = paddleWidth;
    this.paddleHeight = paddleHeight;
    this.movementSpeed = movementSpeed;

    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.strokeWidth = strokeWidth;

    this.paddlePosition = paddlePosition;
    this.movementDirection =
      paddlePosition === "top" || paddlePosition === "bottom"
        ? "horizontal"
        : "vertical";

    this.distanceFromBoundary = distanceFromBoundary;

    if (this.movementDirection === "horizontal") {
      this.paddlePositionCoordinates = {
        x: this.gameWindow.width / 2 - this._paddleWidth / 2,
        y:
          this.paddlePosition === "bottom"
            ? this.gameWindow.height -
              this.paddleHeight -
              this.distanceFromBoundary
            : this.distanceFromBoundary,
      };
    } else if (this.movementDirection === "vertical") {
      this.paddlePositionCoordinates = {
        x:
          this.paddlePosition === "right"
            ? this.gameWindow.width -
              this.paddleHeight -
              this.distanceFromBoundary
            : this.distanceFromBoundary,
        y: this.gameWindow.height / 2 - this._paddleHeight / 2,
      };
    }
  }

  draw(): void {
    this._strokeFill(this.strokeColor);
    this._fill(this.strokeWidth, this.fillColor);
  }

  fps: number = 0;
  currentFrameCount = 0;
  updateConfig(delta: number, webSocket?: WebSocket): void {
    if (!this.fps) {
      this.fps = Math.floor(60 / delta);
      console.log(this.fps, delta);
    }
    this.currentFrameCount += 1;

    if (this.movementDirection === "horizontal") {
      this.paddlePositionCoordinates.x += this.currentSpeed / delta;

      if (
        this.paddlePositionCoordinates.x <
        this.distanceFromBoundary + this.paddleHeight
      )
        this.paddlePositionCoordinates.x =
          this.distanceFromBoundary + this.paddleHeight;
      if (
        this.paddlePositionCoordinates.x >
        this.gameWindow.width -
          this._paddleWidth -
          this.distanceFromBoundary -
          this.paddleHeight
      )
        this.paddlePositionCoordinates.x =
          this.gameWindow.width -
          this._paddleWidth -
          this.distanceFromBoundary -
          this.paddleHeight;
    } else {
      this.paddlePositionCoordinates.y += this.currentSpeed / delta;

      if (
        this.paddlePositionCoordinates.y <
        this.distanceFromBoundary + this.paddleHeight
      )
        this.paddlePositionCoordinates.y =
          this.distanceFromBoundary + this.paddleHeight;
      if (
        this.paddlePositionCoordinates.y >
        this.gameWindow.height -
          this._paddleHeight -
          this.distanceFromBoundary -
          this.paddleHeight
      )
        this.paddlePositionCoordinates.y =
          this.gameWindow.height -
          this._paddleHeight -
          this.distanceFromBoundary -
          this.paddleHeight;
    }

    if (this.currentFrameCount % this.fps === 0) {
      webSocket?.send(
        JSON.stringify({
          updatedPaddleConfig: {
            xPosition: this.paddlePositionCoordinates.x,
            yPosition: this.paddlePositionCoordinates.y,
            paddleIndex: this.paddleIndex,
          },
        })
      );
    }
  }

  /** updates the speed to move in left or up direction  */
  moveMinus() {
    this.currentSpeed = -this.movementSpeed;
  }

  /** updates the speed to move in right or down direction  */
  movePlus() {
    this.currentSpeed = this.movementSpeed;
  }

  /** stops the movement of paddle */
  stop() {
    this.currentSpeed = 0;
  }

  /** draw the rectangle using stroke color */
  private _strokeFill(strokeColor: string) {
    this.gameContext.fillStyle = strokeColor;
    this.gameContext.fillRect(
      this.paddlePositionCoordinates.x,
      this.paddlePositionCoordinates.y,
      this._paddleWidth,
      this._paddleHeight
    );
  }

  /** draw the rectangle using fill color by leaving some space for stroke */
  private _fill(strokeWidth: number, fillColor: string) {
    this.gameContext.fillStyle = fillColor;
    this.gameContext.fillRect(
      this.paddlePositionCoordinates.x + strokeWidth,
      this.paddlePositionCoordinates.y + strokeWidth,
      this._paddleWidth - strokeWidth * 2,
      this._paddleHeight - strokeWidth * 2
    );
  }
}
