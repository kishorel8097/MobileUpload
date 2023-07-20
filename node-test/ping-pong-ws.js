const ws = require("ws");

const server = new ws.Server({ port: 4201, host: "192.168.123.168" }, () => {
  console.log("connection established!");
});

const clients = { 0: undefined, 1: undefined, 2: undefined, 3: undefined };
const ballSpeed = { xSpeed: 0, ySpeed: 0 };
let gameStarted = false;

server.on("connection", (client) => {
  _initClient(client);

  client.on("message", (message) => {
    const jsonmessage = JSON.parse(message.toString());
    const messageKey = Object.keys(jsonmessage)[0];
    const messageData = jsonmessage[messageKey];

    switch (messageKey) {
      case "updatedPaddleConfig":
        _broadcastUpdatedPaddleConfig(messageData);
        break;
    }
  });

  client.on("close", (code, reason) => {
    console.log(code, reason.toString());
    if (clients[0] === client) clients[0] = undefined;
    if (clients[1] === client) clients[1] = undefined;
    if (clients[2] === client) clients[2] = undefined;
    if (clients[3] === client) clients[3] = undefined;
    const remainingClients = _countClients();
    console.log(remainingClients, "remaining clients!");
    if (remainingClients === 0) gameStarted = false;
  });
});

function _broadcastUpdatedPaddleConfig(updatedPaddleConfig) {
  const updatedPaddleIndex = updatedPaddleConfig.paddleIndex;
  const maxPlayers = Number(process.argv[2]) || 4;
  for (let index = 0; index < maxPlayers; index++) {
    if (clients[index] && index !== updatedPaddleIndex) {
      clients[index].send(
        JSON.stringify({ playerPositionUpdated: { ...updatedPaddleConfig } })
      );
    }
  }
}
server.on("close", (code, reason) => {
  console.log(code, reason);
});

function _initClient(client) {
  if (!gameStarted) {
    if (!clients[0]) {
      clients[0] = client;
      _sendClientPaddleConfig(client, 0);
    } else if (!clients[1]) {
      clients[1] = client;
      _sendClientPaddleConfig(client, 1);
    } else if (!clients[2]) {
      clients[2] = client;
      _sendClientPaddleConfig(client, 2);
    } else if (!clients[3]) {
      clients[3] = client;
      _sendClientPaddleConfig(client, 3);
    }
  }

  _initBallConfig();
  const clientsCount = _countClients();
  console.log(clientsCount, "clients connected!");
  if (clientsCount === (Number(process.argv[2]) || 4) && !gameStarted) {
    gameStarted = true;
    _startGame();
  }
}

function _startGame() {
  console.log("game started!");
  const playerPaddles = [];
  Object.keys(clients).forEach((clientIndex) => {
    if (Number(clientIndex) < (Number(process.argv[2]) || 4)) {
      playerPaddles.push(playerPaddleConfig[Number(clientIndex)]);
    }
  });
  Object.keys(clients).forEach((client) => {
    if (clients[Number(client)])
      clients[Number(client)].send(
        JSON.stringify({ gameStarted: { ballSpeed, playerPaddles } })
      );
  });
}

function _countClients() {
  let count = 0;
  if (clients[0]) count += 1;
  if (clients[1]) count += 1;
  if (clients[2]) count += 1;
  if (clients[3]) count += 1;
  return count;
}

function _sendClientPaddleConfig(client, configIndex) {
  client.send(
    JSON.stringify({
      paddleConfig: { ...playerPaddleConfig[configIndex] },
    })
  );
}

function _initBallConfig() {
  if (ballSpeed.xSpeed === 0 && ballSpeed.ySpeed === 0) {
    let xSpeed = Math.floor(Math.random() * 60 * 0.6);
    let ySpeed = 60 - xSpeed;

    let rand = Math.floor(Math.random() * 10);
    if (rand % 2 !== 0) xSpeed *= -1;
    rand = Math.floor(Math.random() * 10);
    if (rand % 2 !== 0) ySpeed *= -1;

    ballSpeed.xSpeed = xSpeed;
    ballSpeed.ySpeed = ySpeed;
  }
}

const playerPaddleConfig = {
  0: { playerIndex: 0, paddlePosition: "bottom", fillColor: "#bbb" },
  1: { playerIndex: 1, paddlePosition: "top", fillColor: "#fbb" },
  2: { playerIndex: 2, paddlePosition: "left", fillColor: "#bfb" },
  3: { playerIndex: 3, paddlePosition: "right", fillColor: "#bbf" },
};
