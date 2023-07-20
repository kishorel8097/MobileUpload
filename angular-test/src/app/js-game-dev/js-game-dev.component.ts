import { AfterViewInit, Component } from "@angular/core";
import { Ball } from "./classes/ball";
import { GameObject } from "./classes/game-object";
import { Paddle } from "./classes/paddle";
import { PositionDimension } from "./types/dimension";
import { Position } from "./types/position";

@Component({
  selector: "js-game-dev",
  templateUrl: "./js-game-dev.component.html",
})
export class JsGameDevComponent implements AfterViewInit {
  /** the canvas object which will be used as game window */
  gameCanvas!: HTMLCanvasElement;
  /** width of the play area */
  gameWidth = 1280 * 0.75;
  /** height of the play area */
  gameHeight = 720 * 0.75;

  /** the context of canvas object which will be used as game window */
  get gameContext(): CanvasRenderingContext2D {
    return this.gameCanvas.getContext("2d") as CanvasRenderingContext2D;
  }

  minusIcon!: string;
  plusIcon!: string;

  __keyUpHandlerForPaddle!: Function;
  __keyDownHandlerForPaddle!: Function;

  /** list of all the game objects */
  gameObjects: GameObject[] = [];

  /** the previous timeframe value for gameloop */
  previousFrameTime = 0;

  webSocket!: WebSocket;
  gameInitialized = false;

  currentPlayer!: Paddle;
  currentPlayerIndex!: number;
  otherPlayers: { [key: number]: Paddle } = {};

  playerPaddleConfig = [
    { playerIndex: 0, paddlePosition: "bottom", fillColor: "#bbb" },
    { playerIndex: 1, paddlePosition: "top", fillColor: "#fbb" },
    { playerIndex: 2, paddlePosition: "left", fillColor: "#bfb" },
    { playerIndex: 3, paddlePosition: "right", fillColor: "#bbf" },
  ];

  ngAfterViewInit(): void {
    this._initConfig();
    this._initCanvasConfig();
    this._initWebSocket();

    this.updateFrame();
  }

  onMoveMinusDown() {
    this.currentPlayer.moveMinus();
  }
  onMoveMinusUp() {
    this.currentPlayer.stop();
  }
  onMovePlusDown() {
    this.currentPlayer.movePlus();
  }
  onMovePlusUp() {
    this.currentPlayer.stop();
  }

  /** the function that executes each frame */
  updateFrame(timeStamp?: number): void {
    if (typeof timeStamp !== "number" || !timeStamp) {
      requestAnimationFrame(this.updateFrame.bind(this));
      return;
    }

    const delta = timeStamp! - this.previousFrameTime;
    this.previousFrameTime = timeStamp!;

    this.gameContext.clearRect(0, 0, this.gameWidth, this.gameHeight);
    this.gameObjects.forEach((gameObject) => {
      gameObject.updateConfig(timeStamp ? delta : 0, this.webSocket);
      gameObject.draw();
    });

    requestAnimationFrame(this.updateFrame.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener("keyup", this.__keyUpHandlerForPaddle as any);
    document.removeEventListener(
      "keydown",
      this.__keyDownHandlerForPaddle as any
    );
  }

  private _initConfig() {
    this.__keyUpHandlerForPaddle = this._keyUpHandlerForPaddle.bind(this);
    this.__keyDownHandlerForPaddle = this._keyDownHandlerForPaddle.bind(this);

    document.addEventListener("keydown", this.__keyDownHandlerForPaddle as any);
    document.addEventListener("keyup", this.__keyUpHandlerForPaddle as any);
  }

  /** initializes the canvas by setting width, height, and other required properties */
  private _initCanvasConfig() {
    this.gameCanvas = document.querySelector(
      ".game-window"
    ) as HTMLCanvasElement;

    this.gameCanvas.width = this.gameWidth;
    this.gameCanvas.height = this.gameHeight;
  }

  private _initGame() {
    this.minusIcon =
      this.currentPlayer.movementDirection === "horizontal"
        ? "pi pi-chevron-left"
        : "pi pi-chevron-up";
    this.plusIcon =
      this.currentPlayer.movementDirection === "horizontal"
        ? "pi pi-chevron-right"
        : "pi pi-chevron-down";
  }

  private _initWebSocket() {
    this.webSocket = new WebSocket("ws://192.168.123.168:4201");

    this.webSocket.addEventListener("message", (event) => {
      const jsonData = JSON.parse(event.data);
      const messageKey = Object.keys(jsonData)[0];
      const messageData = jsonData[messageKey];

      //   console.log({ messageKey, messageData });
      switch (messageKey) {
        case "paddleConfig":
          this.currentPlayer = new Paddle(
            this.gameCanvas,
            90,
            10,
            messageData.paddlePosition,
            45,
            messageData.fillColor
          );
          this.currentPlayerIndex = messageData.playerIndex;
          this.currentPlayer.paddleIndex = this.currentPlayerIndex;
          this.gameObjects.push(this.currentPlayer);
          break;

        case "gameStarted":
          const paddles = messageData.playerPaddles;
          console.log("adding other players", paddles);
          paddles.forEach((paddle: any) => {
            if (paddle.playerIndex !== this.currentPlayerIndex) {
              const otherPlayerPaddle = new Paddle(
                this.gameCanvas,
                90,
                10,
                paddle.paddlePosition,
                45,
                paddle.fillColor
              );
              otherPlayerPaddle.paddleIndex = paddle.playerIndex;
              this.otherPlayers[paddle.playerIndex] = otherPlayerPaddle;
              this.gameObjects.push(otherPlayerPaddle);
            }
          });
          const ball = new Ball(this.gameCanvas);
          ball.ballSpeed = {
            x: messageData.ballSpeed.xSpeed,
            y: messageData.ballSpeed.ySpeed,
          };
          ball.collisionObjects.push(this.currentPlayer);
          Object.keys(this.otherPlayers).forEach((player) => {
            ball.collisionObjects.push(this.otherPlayers[Number(player)]);
            this.gameObjects.push(this.otherPlayers[Number(player)]);
          });
          this.gameObjects.push(ball);
          break;

        case "playerPositionUpdated":
          const paddleIndex: number = messageData.paddleIndex;
          const paddlePosition: PositionDimension = {
            x: messageData.xPosition,
            y: messageData.yPosition,
          };
          const paddleConfig = this.playerPaddleConfig[paddleIndex];

          if (this.otherPlayers[paddleIndex]) {
            this.otherPlayers[paddleIndex].paddlePositionCoordinates =
              paddlePosition;
          }
          break;

        default:
          break;
      }

      if (!this.gameInitialized) {
        this._initGame();
        this.gameInitialized = true;
      }
    });
  }

  private _keyDownHandlerForPaddle(keyboardEvent: KeyboardEvent) {
    switch (keyboardEvent.key) {
      case "ArrowLeft":
        if (this.currentPlayer.movementDirection === "horizontal")
          this.currentPlayer.moveMinus();
        break;
      case "ArrowRight":
        if (this.currentPlayer.movementDirection === "horizontal")
          this.currentPlayer.movePlus();
        break;
      case "ArrowUp":
        if (this.currentPlayer.movementDirection === "vertical")
          this.currentPlayer.moveMinus();
        break;
      case "ArrowDown":
        if (this.currentPlayer.movementDirection === "vertical")
          this.currentPlayer.movePlus();
        break;
    }
  }

  private _keyUpHandlerForPaddle(keyboardEvent: KeyboardEvent) {
    switch (keyboardEvent.key) {
      case "ArrowLeft":
      case "ArrowUp":
        if (this.currentPlayer.currentSpeed < 0) this.currentPlayer.stop();
        break;
      case "ArrowRight":
      case "ArrowDown":
        if (this.currentPlayer.currentSpeed > 0) this.currentPlayer.stop();
        break;
    }
  }
}
