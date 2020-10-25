const msgpack = require("msgpack-lite");
let { clients, qt, candies, lb_timer } = require("./index");
const { Vector, Player, Candy, isWhiteSpace, emitAll } = require("./utility");

function Update(){
  if(candies.length<50){
    spawnCandy();
  }
  const e = [];
  clients.forEach(c => {
    c.update();
    if(lb_timer >= 30){
      e.push({
        id: c.id,
        x: Math.round(c.x),
        y: Math.round(c.y),
        s: c.score
      })
    } else {
      e.push({
        id: c.id,
        x: Math.round(c.x),
        y: Math.round(c.y)
      })
    }
  })
  clients.forEach(c => {
    let ee = JSON.parse(JSON.stringify(e));
    ee = ee.filter(i => i.id!=c.id);
    ee.forEach(o => {
      delete o.id;
    });
    const payLoad = {
      m: "u",
      e: ee,
      p: {}
    };
    if(lb_timer >= 30){
      payLoad.p = {
        x: Math.round(c.x),
        y: Math.round(c.y),
        s: c.score
      };
    } else {
      payLoad.p = {
        x: Math.round(c.x),
        y: Math.round(c.y)
      };
    }
    c.ws.send(msgpack.encode(payLoad));
  })
  if(lb_timer >= 30)lb_timer=0;
  lb_timer++;
}

function spawnCandy(){
  const x = getRandomInt(50, 1950);
  const y = getRandomInt(50, 1950);
  const candy = new Candy(x, y);
  candies.push(candy);
  qt.push({
    x: x-6,
    y: y-6,
    width: 12,
    height: 12,
    type: "candy",
    item: candy
  })
  const payLoad = {
    m: "c",
    x: x,
    y: y
  }
  emitAll(msgpack.encode(payLoad));
}


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

module.exports = Update;