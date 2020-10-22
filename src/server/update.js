const msgpack = require("msgpack-lite");
const clients = require("./index");

function Update(){
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

module.exports = Update;