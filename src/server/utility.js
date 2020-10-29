const { clients, qt, candies, gums, lb_timer } = require("./index");
const uuid = require("uuid");
const msgpack = require("msgpack-lite");
const attackPaths = require("./min/attack.min");

const MAP_SIZE = 2000;

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  normalize() {
    const m = Math.sqrt(this.x * this.x + this.y * this.y);
    this.x /= m || 1;
    this.y /= m || 1;
  }
}

class Candy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.id = uuid.v4();
    const payLoad = {
      m: "c",
      x: x,
      y: y
    }
    emitAll(msgpack.encode(payLoad));
    qt.push({
      x: x - 6,
      y: y - 6,
      width: 12,
      height: 12,
      type: "candy",
      item: this
    });
  }
  delete() {
    const payLoad = {
      m: "rc",
      i: candies.indexOf(this)
    };
    candies.splice(candies.indexOf(this), 1);
    qt.remove(qt.find(e => {
      return e.item.id == this.id;
    })[0]);
    emitAll(msgpack.encode(payLoad));
  }
}

class Gum {
  constructor(x, y, xv, yv, client_id, speed) {
    this.x = x + xv;
    this.y = y + yv;
    this.xv = xv * speed;
    this.yv = yv * speed;
    this.lifespan = 50;
    this.id = uuid.v4();
    this.client_id = client_id;
    qt.push({
      x: x - 8,
      y: y - 8,
      width: 16,
      height: 16,
      type: "gum",
      item: this
    }, true);
  }
  update() {
    this.x += this.xv;
    this.y += this.yv;
    if (this.x < 8 || this.x > MAP_SIZE - 8 || this.y < 8 || this.y > MAP_SIZE - 8) this.delete();
    let q = qt.find(e => {
      return e.item.id == this.id;
    })[0];
    if (q) {
      q.x = this.x - 8;
      q.y = this.y - 8;
    }
    this.lifespan--;
  }
  delete() {
    if (qt.find(e => {
      return e.item.id == this.id;
    })[0]) {
      qt.remove(qt.find(e => {
        return e.item.id == this.id;
      })[0]);
      gums.splice(gums.indexOf(this), 1);
    }
  }
}

class Player {
  constructor(id, nick, ws) {
    this.x = getRandomInt(50, MAP_SIZE - 50);
    this.y = getRandomInt(50, MAP_SIZE - 50);
    this.score = 0;
    this.reload = 0;
    this.spd = 9;
    this.id = id;
    this.nickname = nick;
    this.ws = ws;
    this.up = 0;
    this.down = 0;
    this.left = 0;
    this.right = 0;
    this.invis = 0;
    this.baseinvis = 0;
    this.alive = true;
    this.killedBy = "";
    this.respawn = false;
  }
  update() {
    if (this.alive) {
      this.move();
      this.collisions();
      if (this.invis < 0) {
        this.invis++;
      }
      if (this.invis > 0) {
        if (this.invis == 1) {
          this.invis = -300;
        }
        this.invis--;
      }
    } else {
      this.x = this.killedBy.x;
      this.y = this.killedBy.y;
    }
  }
  attack(dir) {
    const paths = attackPaths(this.reload, dir);
    paths.forEach(p => {
      const xv = Math.cos(p);
      const yv = Math.sin(p);
      gums.push(new Gum(this.x, this.y, xv, yv, this.id, 15));
    })
    this.reload = 0;
  }
  collisions() {
    const colliding = qt.colliding({
      x: this.x - 20,
      y: this.y - 20,
      width: 40,
      height: 40
    }, (e1, e2) => {
      return dist(this.x, this.y, e2.x + e2.width / 2, e2.y + e2.width / 2) < 20 + e2.width / 2;
    })
    colliding.forEach(c => {
      if (c.type == "candy") {
        c.item.delete();
        this.score++;
        this.reload++;
        if (this.reload > 5) this.reload = 5;
      } else if (c.type == "gum") {
        if (c.item.client_id != this.id) {
          c.item.delete();
          if (this.alive == true) {
            this.alive = false;
            this.killedBy = clients.find(e => e.id == c.item.client_id);
            let payLoad = {
              m: "di",
              k: this.killedBy.nickname,
              s: this.score
            };
            this.ws.send(msgpack.encode(payLoad));
            payLoad = {
              m: "k",
              k: this.nickname
            }
            this.killedBy.ws.send(msgpack.encode(payLoad));
            emitAll(msgpack.encode(
              {
                m: "rn",
                i: this.id
              }
            ), [this]);
            const gainedScore = Math.round(Math.pow(this.score, 0.9)) + 2;
            this.killedBy.score += gainedScore;
          }
        }
      }
    })
  }
  move() {
    const m = new Vector(this.left + this.right, this.up + this.down);
    m.normalize();
    this.x += m.x * this.spd;
    this.y += m.y * this.spd;

    if (this.x < 0) this.x = 0;
    if (this.x > MAP_SIZE) this.x = MAP_SIZE;
    if (this.y < 0) this.y = 0;
    if (this.y > MAP_SIZE) this.y = MAP_SIZE;
  }
}

function dist(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function isWhiteSpace(string) {
  if (/\S/.test(string) && string != null) return false;
  return true;
}

function emitAll(message, exception) {
  if (!exception) exception = [];
  exception = exception.map(c => c.id);
  clients.forEach(c => {
    if (!exception.includes(c.id)) {
      c.ws.send(message);
    }
  })
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

module.exports = { Vector, Player, Candy, isWhiteSpace, emitAll };