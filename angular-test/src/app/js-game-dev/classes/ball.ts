import { PositionDimension } from "../types/dimension";
import { GameObject } from "./game-object";
import { Paddle } from "./paddle";

export class Ball extends GameObject {
  radius: number;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;

  ballPosition: PositionDimension;
  ballSpeed!: PositionDimension;

  collisionObjects: GameObject[];

  constructor(
    canvas: HTMLCanvasElement,
    collisionObjects: GameObject[] = [],
    radius = 8,
    ballSpeed = 60,
    fillColor = "#ffa500",
    strokeColor = "#000",
    strokeWidth = 1
  ) {
    super(canvas);

    this.radius = radius;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.strokeWidth = strokeWidth;
    this.collisionObjects = collisionObjects;

    this.ballPosition = {
      x: this.gameWindow.width / 2,
      y: this.gameWindow.height / 2,
    };
  }

  draw(): void {
    this.gameContext.fillStyle = this.strokeColor;
    this.gameContext.beginPath();
    this.gameContext.ellipse(
      this.ballPosition.x,
      this.ballPosition.y,
      this.radius,
      this.radius,
      1,
      0,
      360
    );
    this.gameContext.stroke();
    this.gameContext.fill();

    this.gameContext.fillStyle = this.fillColor;
    this.gameContext.beginPath();
    this.gameContext.ellipse(
      this.ballPosition.x,
      this.ballPosition.y,
      this.radius - this.strokeWidth,
      this.radius - this.strokeWidth,
      1,
      0,
      360
    );

    this.gameContext.stroke();
    this.gameContext.fill();
  }

  updateConfig(delta: number, webSocket?: WebSocket): void {
    if (this.ballSpeed) {
      const changeDirection = this._checkCollision();

      if (changeDirection === "x") {
        this.ballSpeed.x = -this.ballSpeed.x;
      }
      if (changeDirection === "y") {
        this.ballSpeed.y = -this.ballSpeed.y;
      }

      this.ballPosition = {
        x: this.ballPosition.x + this.ballSpeed.x / delta,
        y: this.ballPosition.y + this.ballSpeed.y / delta,
      };
    }
  }

  private _checkCollision(): "x" | "y" | null {
    for (let index = 0; index < this.collisionObjects.length; index++) {
      const collisionObject = this.collisionObjects[index];
      if (collisionObject instanceof Paddle) {
        switch (collisionObject.paddlePosition) {
          case "bottom":
            if (
              this.ballPosition.x >=
                collisionObject.paddlePositionCoordinates.x &&
              this.ballPosition.x <=
                collisionObject.paddlePositionCoordinates.x +
                  collisionObject._paddleWidth &&
              Math.abs(
                collisionObject.paddlePositionCoordinates.y -
                  (this.ballPosition.y + this.radius)
              ) < 2
            ) {
              return "y";
            }
            break;
          case "top":
            if (
              this.ballPosition.x >=
                collisionObject.paddlePositionCoordinates.x &&
              this.ballPosition.x <=
                collisionObject.paddlePositionCoordinates.x +
                  collisionObject._paddleWidth &&
              Math.abs(
                collisionObject.paddlePositionCoordinates.y +
                  collisionObject._paddleHeight -
                  (this.ballPosition.y - this.radius)
              ) < 2
            ) {
              return "y";
            }
            break;
          case "right":
            if (
              Math.abs(
                this.gameWindow.width -
                  collisionObject.distanceFromBoundary -
                  collisionObject._paddleWidth -
                  (this.radius + this.ballPosition.x)
              ) < 2 &&
              this.ballPosition.y >=
                collisionObject.paddlePositionCoordinates.y &&
              this.ballPosition.y <=
                collisionObject.paddlePositionCoordinates.y +
                  collisionObject._paddleHeight
            ) {
              return "x";
            }
            break;
          case "left":
            if (
              Math.abs(
                collisionObject.distanceFromBoundary +
                  collisionObject._paddleWidth -
                  (this.ballPosition.x - this.radius)
              ) < 2 &&
              this.ballPosition.y >=
                collisionObject.paddlePositionCoordinates.y &&
              this.ballPosition.y <=
                collisionObject.paddlePositionCoordinates.y +
                  collisionObject._paddleHeight
            ) {
              return "x";
            }
            break;
        }
      }
    }

    return null;
  }
}
