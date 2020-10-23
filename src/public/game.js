function joinGame(){
  document.getElementById("menu").style.display = "none";
  document.getElementById("canvas").style.display = "block";
  pl_c = true;
  game();
}

function game(){
  drawGame();
  drawCandy(500, 500, 5, "red", "blue");
  requestAnimationFrame(game);
}

function drawMap(){
  const MAP_SIZE = 2000;
  const INTERVAL_SIZE = 250;
  for(let c=-MAP_SIZE/INTERVAL_SIZE*2; c<MAP_SIZE/INTERVAL_SIZE; c++){
    ctx.beginPath();
    ctx.lineTo(canvas.width/2-(player.x+c*INTERVAL_SIZE), canvas.height/2-(player.y-MAP_SIZE/2));
    ctx.lineTo(canvas.width/2-(player.x+c*INTERVAL_SIZE), canvas.height/2-(player.y+MAP_SIZE/2));
    ctx.stroke();
  }
  for(let c=-MAP_SIZE/INTERVAL_SIZE*2; c<MAP_SIZE/INTERVAL_SIZE; c++){
    ctx.beginPath();
    ctx.lineTo(canvas.width/2-(player.x-MAP_SIZE/2), canvas.height/2-(player.y+c*INTERVAL_SIZE));
    ctx.lineTo(canvas.width/2-(player.x+MAP_SIZE/2), canvas.height/2-(player.y+c*INTERVAL_SIZE));
    ctx.stroke();
  }
}

function drawGame(){
  ctx.beginPath();
  ctx.fillStyle = "brown";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawMap();
  drawEnemies();
  drawGhost(canvas.width/2, canvas.height/2, 20, "#fff");
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.font = "30px Poppins";
  ctx.textAlign = "center";
  ctx.fillText(nickname, canvas.width/2, canvas.height/2+55);
}

function drawEnemies(){
  for(let e in enemies){
    drawGhost(canvas.width/2-(player.x-enemies[e].x), canvas.height/2-(player.y-enemies[e].y), 20, "#fff");
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.font = "30px Poppins";
    ctx.textAlign = "center";
    ctx.fillText(names[e].n, canvas.width/2-(player.x-enemies[e].x), canvas.height/2-(player.y-enemies[e].y)+55);
  }
}