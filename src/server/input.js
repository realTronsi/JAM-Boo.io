function Input(msg, client){
  if(msg.m=="kd"||msg.m=="ku"){
    const v = msg.m=="kd"?1:0;
    if(msg.k==87||msg.k=='w'){
      client.up = -v;
    }
    if(msg.k==83||msg.k=='s'){
      client.down = v;
    }
    if(msg.k==65||msg.k=='a'){
      client.left = -v;
    }
    if(msg.k==88||msg.k=='d'){
      client.right = v;
    }
  } else if(msg.m=="m" && client.reload>0) {
    const r_x = msg.x-(msg.w/2)+client.x;
    const r_y = msg.y-(msg.h/2)+client.y;
    const dir = Math.atan2(r_y-client.y, r_x-client.x);
    client.attack(dir);
  }
}

module.exports = Input;