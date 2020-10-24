function joinGame(){
  document.getElementById("menu").style.display = "none";
  document.getElementById("canvas").style.display = "block";
  pl_c = true;
  game();
}

function game(){
  drawGame();
  requestAnimationFrame(game);
}

function drawGame(){
  drawMap();
  drawCandies();
  drawEnemies();
  drawGhost(canvas.width/2, canvas.height/2, 20, "#fff");
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.font = "30px Poppins";
  ctx.textAlign = "center";
  ctx.fillText(nickname, canvas.width/2, canvas.height/2+55);
}

function drawMap(){
  ctx.beginPath();
  ctx.fillStyle = "rgb(20, 20, 20)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const MAP_SIZE = 2000;
  const INTERVAL_SIZE = 250;
  ctx.strokeStyle = "rgb(120, 120, 120)";
  ctx.lineCap = "round";
  for(let c=-MAP_SIZE/(INTERVAL_SIZE*2); c<MAP_SIZE/(INTERVAL_SIZE*2)+1; c++){
    ctx.beginPath();
    if(c==-MAP_SIZE/(INTERVAL_SIZE*2)||c==MAP_SIZE/(INTERVAL_SIZE*2))ctx.lineWidth = 20;
    ctx.moveTo(canvas.width/2-(player.x-MAP_SIZE/2+c*INTERVAL_SIZE), canvas.height/2-(player.y-MAP_SIZE));
    ctx.lineTo(canvas.width/2-(player.x-MAP_SIZE/2+c*INTERVAL_SIZE), canvas.height/2-(player.y));
    ctx.stroke();
    ctx.lineWidth = 5;
  }
  for(let c=-MAP_SIZE/(INTERVAL_SIZE*2); c<MAP_SIZE/(INTERVAL_SIZE*2)+1; c++){
    ctx.beginPath();
    if(c==-MAP_SIZE/(INTERVAL_SIZE*2)||c==MAP_SIZE/(INTERVAL_SIZE*2))ctx.lineWidth = 20;
    ctx.moveTo(canvas.width/2-(player.x-MAP_SIZE), canvas.height/2-(player.y-MAP_SIZE/2+c*INTERVAL_SIZE));
    ctx.lineTo(canvas.width/2-(player.x), canvas.height/2-(player.y-MAP_SIZE/2+c*INTERVAL_SIZE));
    ctx.stroke();
    ctx.lineWidth = 5;
  }
  ctx.lineCap = "butt";
}

function drawEnemies(){
  for(let e in enemies){
    drawGhost(canvas.width/2-(player.x-enemies[e].x), canvas.height/2-(player.y-enemies[e].y), 20, "#fff");
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.font = "30px Poppins";
    ctx.textAlign = "center";
    ctx.fillText(names[e].n, canvas.width/2-(player.x-enemies[e].x), canvas.height/2-(player.y-enemies[e].y)+55);
  }
}

function drawCandies(){
  for(let c in candies){
    drawCandy(canvas.width/2-(player.x-candies[c].x), canvas.height/2-(player.y-candies[c].y), 5, "#f55a42", "#f5c6bf");
  }
}