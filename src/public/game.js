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

function drawGame(){
  ctx.beginPath();
  ctx.fillStyle = "brown";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawEnemies();
  drawGhost(canvas.width/2, canvas.height/2, 20, "#fff");
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.font = "30px Poppins";
  ctx.fillText(nickname, canvas.width/2, canvas.height/2);
}

function drawEnemies(){
  for(let e in enemies){
    drawGhost(canvas.width/2-(player.x-enemies[e].x), canvas.height/2-(player.y-enemies[e].y), 20, "#fff");
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.font = "30px Poppins";
    ctx.fillText(names[e].n, canvas.width/2-(player.x-enemies[e].x), canvas.height/2-(player.y-enemies[e].y));
  }
}