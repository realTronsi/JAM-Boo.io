const express = require('express');
const WebSocket = require('ws');
const uuid = require("uuid");
const app = express();
Quadtree = require("quadtree-lib");
const msgpack = require("msgpack-lite");

const fs = require("fs");
const util = require("util");

let errlog = fs.createWriteStream(__dirname + '/errorlog.txt', { flags: 'a' });

process.on('uncaughtException', function(err) {
  console.log(err);
  let d = new Date();
  errlog.write(util.format(`${d.toString()}: ${err}\n\n`));
});

const wss = new WebSocket.Server({ noServer: true });

const clients = [];
const candies = [];
const gums = [];

let lb_timer = 0;

qt = new Quadtree({
  width: 2000,
  height: 2000,
  maxElements: 20
});

module.exports = { clients, qt, candies, gums, lb_timer };

const { Update, respawn_queue } = require("./update");
const { Vector, Player, Candy, isWhiteSpace, emitAll } = require("./utility");
const Input = require("./input");

setInterval(Update, 30);

app.use(express.static("src/public"));
app.use(express.static("src/public/util"));
app.use(express.static("src/public/graphics"));
app.use(express.static("src/public/graphics/extra"));

app.get("/", (req, res) => {
  res.sendFile("index.html");
});
app.get("*", (req, res) => {
  res.redirect("/");
})

wss.on("connection", ws => {
  ws.binaryType = 'arraybuffer';
  const id = uuid.v4();
  let client = null;
  ws.on("message", e => {
    try {
      const msg = msgpack.decode(new Uint8Array(e));
      if (msg.m == "j" && client == null) {
        let nickname = msg.n;
        nickname = nickname.slice(0, 13);
        if (isWhiteSpace(nickname)) {
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
        let filtered_clients = clients.filter(c => c.alive == true);
        let names = filtered_clients.map(c => c.nickname);
        let ids = filtered_clients.map(c => c.id);
        clients.push(client);

        let __candies__ = [];

        const _cand = JSON.parse(JSON.stringify(candies));
        _cand.forEach(c => delete c.id);
        _cand.forEach(c => __candies__.push({ x: c.x, y: c.y }));

        const payLoad = {
          m: "j",
          n: nickname,
          s: names,
          i: ids,
          c: __candies__
        };
        ws.send(msgpack.encode(payLoad));
        lb_timer = 30;
      } else {
        Input(msg, client);
      }
    } catch (err) {
      console.log(err)
    }
  })
  ws.on("close", e => {
    clients.splice(clients.indexOf(clients.find(c => c.id == client.id)), 1);
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