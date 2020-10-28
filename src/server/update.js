const msgpack = require("msgpack-lite");
let { clients, qt, candies, gums, lb_timer } = require("./index");
const { Vector, Player, Candy, isWhiteSpace, emitAll } = require("./utility");

const respawn_queue = [];

function Update() {
  if (candies.length < 50) {
    spawnCandy();
  }
  const e = [];
  clients.forEach(c => {
    c.update();
    if (c.respawn == true) {
      respawn_queue.push(c);
    }
    if (c.alive == true) {
      if (lb_timer >= 30) {
        if (c.baseinvis - c.invis > 15 && c.invis > 0) {
          e.push({
            id: c.id,
            x: null,
            y: null,
            s: c.score
          })
        } else if (c.baseinvis - c.invis <= 15 && c.invis > 0) {
          e.push({
            id: c.id,
            x: Math.round(c.x),
            y: Math.round(c.y),
            s: c.score,
            i: c.baseinvis - c.invis
          })
        } else {
          e.push({
            id: c.id,
            x: Math.round(c.x),
            y: Math.round(c.y),
            s: c.score
          })
        }
      } else {
        if (c.baseinvis - c.invis > 15 && c.invis > 0) {
          e.push({
            id: c.id,
            x: null,
            y: null
          })
        } else if (c.invis > 0 && c.baseinvis - c.invis <= 15) {
          e.push({
            id: c.id,
            x: Math.round(c.x),
            y: Math.round(c.y),
            i: c.baseinvis - c.invis
          })
        } else {
          e.push({
            id: c.id,
            x: Math.round(c.x),
            y: Math.round(c.y)
          })
        }
      }
    }
  })
  gums.forEach(g => {
    g.update();
    if (g.lifespan < 0) {
      g.delete();
    }
  });
  clients.forEach(c => {
    let ee = JSON.parse(JSON.stringify(e));
    ee = ee.filter(i => i.id != c.id);
    ee.forEach(o => {
      delete o.id;
    });
    let _gg = qt.find(g => g.type == "gum" && Math.abs((g.x + 6) - c.x) < 800 && Math.abs((g.y + 6) - c.y) < 450);
    const gg = [];
    _gg.forEach(g => {
      gg.push({
        x: Math.round(g.item.x),
        y: Math.round(g.item.y)
      });
    });
    const payLoad = {
      m: "u",
      e: ee,
      g: gg,
      p: {}
    };
    if (lb_timer >= 30) {
      payLoad.p = {
        x: Math.round(c.x),
        y: Math.round(c.y),
        r: c.reload,
        i: c.invis,
        s: c.score
      };
    } else {
      payLoad.p = {
        x: Math.round(c.x),
        y: Math.round(c.y),
        i: c.invis,
        r: c.reload
      };
    }
    c.ws.send(msgpack.encode(payLoad));
  });
  if (lb_timer >= 30) lb_timer = 0;
  lb_timer++;

  respawn_queue.forEach(c => {
    const MAP_SIZE = 2000;
    c.x = getRandomInt(50, MAP_SIZE - 50);
    c.y = getRandomInt(50, MAP_SIZE - 50);
    c.score = Math.round(Math.pow(c.score, 0.7));
    c.reload = 0;
    c.spd = 9;
    c.up = 0;
    c.down = 0;
    c.left = 0;
    c.right = 0;
    c.invis = 0;
    c.baseinvis = 0;
    c.alive = true;
    c.respawn = false;
    c.killedBy = "";
    emitAll(msgpack.encode(
      {
        m: "n",
        n: c.nickname,
        i: c.id
      }
    ), [c]);
    c.ws.send(msgpack.encode({
      m: "r"
    }));
    clients.push(clients.splice(clients.indexOf(clients.find(e => e.id == c.id)), 1)[0]);
  })
}

function spawnCandy() {
  const x = getRandomInt(50, 1950);
  const y = getRandomInt(50, 1950);
  candies.push(new Candy(x, y));
}


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

module.exports = { Update, respawn_queue };