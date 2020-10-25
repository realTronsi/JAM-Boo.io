const { clients, qt, candies, lb_timer } = require("./index");
const uuid = require("uuid");
const msgpack = require("msgpack-lite");

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  normalize() {
    const m = Math.sqrt(this.x * this.x + this.y * this.y);
    this.x /= m||1;
    this.y /= m||1;
  }
}

class Candy {
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.id = uuid.v4();
  }
}

class Player {
  constructor(id, nick, ws) {
    this.x = 1000;
    this.y = 1000;
    this.score = 0;
    this.spd = 9;
    this.id = id;
    this.nickname = nick;
    this.ws = ws;
    this.up = 0;
    this.down = 0;
    this.left = 0;
    this.right = 0;
    this.alive = true;
    this.invis = 0; //0-9
  }
  update(){
    this.move();
    this.collisions();
  }
  collisions(){
    const colliding = qt.colliding({
      x: this.x-20,
      y: this.y-20,
      width: 40,
      height: 40
    }, (e1, e2)=>{
      return dist(this.x, this.y, e2.x+e2.width/2, e2.y+e2.width/2)<20+e2.width/2;
    })
    colliding.forEach(c => {
      if(c.type == "candy"){
        const candy = candies.find(e=>e.id==c.item.id);
        if(candy!=null){
          const payLoad = {
            m: "rc",
            i: candies.indexOf(candy)
          };
          candies.splice(candies.indexOf(candy), 1);
          emitAll(msgpack.encode(payLoad));
        }
        this.score++
        qt.remove(c);
      }
    })
  }
  move() {
    const m = new Vector(this.left + this.right, this.up + this.down);
    m.normalize();
    this.x += m.x*this.spd;
    this.y += m.y*this.spd;

    const MAP_SIZE = 2000;

    if(this.x<0)this.x=0;
    if(this.x>MAP_SIZE)this.x=MAP_SIZE;
    if(this.y<0)this.y=0;
    if(this.y>MAP_SIZE)this.y=MAP_SIZE;
  }
}

function dist(x1, y1, x2, y2){
  return Math.sqrt(Math.pow(x2-x1, 2)+Math.pow(y2-y1, 2));
}

function isWhiteSpace(string){
  if(/\S/.test(string)&&string!=null)return false;
  return true;
}

function emitAll(message, exception){
  if(!exception)exception = [];
  exception = exception.map(c=>c.id);
  clients.forEach(c=>{
    if(!exception.includes(c.id)){
      c.ws.send(message);
    }
  })
}

module.exports = { Vector, Player, Candy, isWhiteSpace, emitAll };