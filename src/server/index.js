const express = require('express');
const WebSocket = require('ws');
const uuid = require("uuid");
const app = express();
Quadtree = require("quadtree-lib");
const msgpack = require("msgpack-lite");

const wss = new WebSocket.Server({ noServer: true });

const clients = [];
const candies = [];

let lb_timer = 0;

qt = new Quadtree({
  width: 2000,
  height: 2000,
  maxElements: 20
});

module.exports = { clients, qt, candies, lb_timer };

const { Vector, Player, Candy, isWhiteSpace, emitAll } = require("./utility");
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

        let __candies__ = [];

        const _cand = JSON.parse(JSON.stringify(candies));
        _cand.forEach(c => delete c.id);
        _cand.forEach(c=>__candies__.push({x:c.x, y:c.y}));

        const payLoad = {
          m: "j",
          n: nickname,
          s: names,
          i: ids,
          c: __candies__
        };
        ws.send(msgpack.encode(payLoad));
        lb_timer = 30;
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