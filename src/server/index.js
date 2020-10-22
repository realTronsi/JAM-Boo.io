const express = require('express');
const WebSocket = require('ws');
const uuid = require("uuid");
const app = express();
const msgpack = require("msgpack-lite");

const wss = new WebSocket.Server({ noServer: true });

const clients = [];

module.exports = clients;

const { Vector, Player, isWhiteSpace, emitAll } = require("./utility");
const Update = require("./update");
const Input = require("./input");

setInterval(Update, 30);

app.use(express.static("src/public"));
app.use(express.static("src/public/util"));
app.use(express.static("src/public/graphics"));

app.get("/", (req, res) => {
  res.sendFile("index.html");
});
app.get("*", (req, res)=>{
  res.redirect("/");
})

wss.on("connection", ws => {
  ws.binaryType = 'arraybuffer';
  const id = uuid.v4();
  let client;
  ws.on("message", e => {
    try {
      const msg = msgpack.decode(new Uint8Array(e));
      if(msg.m=="j"){
        let nickname = msg.n
        if(isWhiteSpace(nickname)){
          nickname = "Player"
        }
        client = new Player(id, nickname, ws);
        emitAll(msgpack.encode(
          {
            m: "n",
            n: nickname,
            i: id
          }
        ));
        names = clients.map(c=>c.nickname);
        ids = clients.map(c=>c.id);
        clients.push(client);
        const payLoad = {
          m: "j",
          n: nickname,
          s: names,
          i: ids
        };
        ws.send(msgpack.encode(payLoad));
      }
      if(msg.m=="kd"||msg.m=="ku")Input(msg, client);
    } catch (err){
      console.log(err)
    }
  })
  ws.on("close", e => {
    clients.splice(clients.indexOf(clients.find(c=>c.id==client.id)), 1);
    emitAll(msgpack.encode(
      {
        m: "rn",
        i: id
      }
    ))
  })
});

const server = app.listen(3000);

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, socket => {
    wss.emit('connection', socket, request);
  });
});