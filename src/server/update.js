const msgpack = require("msgpack-lite");
const { clients, qt, candies } = require("./index");
const { Vector, Player, Candy, isWhiteSpace, emitAll } = require("./utility");

function Update(){
  if(candies.length<50){
    spawnCandy();
  }
  const e = [];
  clients.forEach(c => {
    c.move();
    e.push({
      id: c.id,
      x: Math.round(c.x),
      y: Math.round(c.y)
    })
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
    payLoad.p = {
      x: Math.round(c.x),
      y: Math.round(c.y)
    };
    c.ws.send(msgpack.encode(payLoad));
  })
}

function spawnCandy(){
  const x = getRandomInt(50, 1950);
  const y = getRandomInt(50, 1950);
  const candy = new Candy(x, y);
  candies.push(candy);
  qt.push({
    x: x-5,
    y: y-5,
    width: 10,
    height: 10,
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