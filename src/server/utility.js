const clients = require("./index");

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

class Player {
  constructor(id, nick, ws) {
    this.x = 0;
    this.y = 0;
    this.s = 9; //speed
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
  move() {
    const m = new Vector(this.left + this.right, this.up + this.down);
    m.normalize();
    this.x += m.x*this.s;
    this.y += m.y*this.s;

    const MAP_SIZE = 2000;

    if(this.x<-MAP_SIZE/2)this.x=-MAP_SIZE/2;
    if(this.x>MAP_SIZE/2)this.x=MAP_SIZE/2;
    if(this.y<-MAP_SIZE/2)this.y=-MAP_SIZE/2;
    if(this.y>MAP_SIZE/2)this.y=MAP_SIZE/2;
  }
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

module.exports = { Vector, Player, isWhiteSpace, emitAll };