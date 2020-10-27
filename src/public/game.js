function joinGame() {
  document.getElementById("menu").style.display = "none";
  document.getElementById("canvas").style.display = "block";
  pl_c = true;
  game();
}

function game() {
  drawGame();
  requestAnimationFrame(game);
}

function drawGame() {
  drawMap();
  drawCandies();
  drawGums();
  drawEnemies();
  if (alive == 0) {
    drawGhost(canvas.width / 2, canvas.height / 2, 20, "#fff");
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.font = "30px Poppins";
    ctx.textAlign = "center";
    const fit_name = fitText(nickname, 350);
    ctx.fillText(fit_name, canvas.width / 2, canvas.height / 2 + 55);
    drawLB();
    drawAmmo(player.reload);
  } else {
    if(alive < 50){
      alive++
    }
    ctx.beginPath();
  }
}

function drawMap() {
  ctx.beginPath();
  ctx.fillStyle = "rgb(20, 20, 20)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const MAP_SIZE = 2000;
  const INTERVAL_SIZE = 250;
  ctx.strokeStyle = "rgb(120, 120, 120)";
  ctx.lineCap = "round";
  for (let c = -MAP_SIZE / (INTERVAL_SIZE * 2); c < MAP_SIZE / (INTERVAL_SIZE * 2) + 1; c++) {
    ctx.beginPath();
    if (c == -MAP_SIZE / (INTERVAL_SIZE * 2) || c == MAP_SIZE / (INTERVAL_SIZE * 2)) ctx.lineWidth = 20;
    ctx.moveTo(canvas.width / 2 - (player.x - MAP_SIZE / 2 + c * INTERVAL_SIZE), canvas.height / 2 - (player.y - MAP_SIZE));
    ctx.lineTo(canvas.width / 2 - (player.x - MAP_SIZE / 2 + c * INTERVAL_SIZE), canvas.height / 2 - (player.y));
    ctx.stroke();
    ctx.lineWidth = 5;
  }
  for (let c = -MAP_SIZE / (INTERVAL_SIZE * 2); c < MAP_SIZE / (INTERVAL_SIZE * 2) + 1; c++) {
    ctx.beginPath();
    if (c == -MAP_SIZE / (INTERVAL_SIZE * 2) || c == MAP_SIZE / (INTERVAL_SIZE * 2)) ctx.lineWidth = 20;
    ctx.moveTo(canvas.width / 2 - (player.x - MAP_SIZE), canvas.height / 2 - (player.y - MAP_SIZE / 2 + c * INTERVAL_SIZE));
    ctx.lineTo(canvas.width / 2 - (player.x), canvas.height / 2 - (player.y - MAP_SIZE / 2 + c * INTERVAL_SIZE));
    ctx.stroke();
    ctx.lineWidth = 5;
  }
  ctx.lineCap = "butt";
}

function drawEnemies() {
  for (let e in enemies) {
    drawGhost(canvas.width / 2 - (player.x - enemies[e].x), canvas.height / 2 - (player.y - enemies[e].y), 20, "#fff");
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.font = "30px Poppins";
    ctx.textAlign = "center";
    if (names[e] != undefined) {
      const fit_name = fitText(names[e].n, 350);
      ctx.fillText(fit_name, canvas.width / 2 - (player.x - enemies[e].x), canvas.height / 2 - (player.y - enemies[e].y) + 55);
    }
  }
}

function drawCandies() {
  for (let c in candies) {
    drawCandy(canvas.width / 2 - (player.x - candies[c].x), canvas.height / 2 - (player.y - candies[c].y), 6, "#f55a42", "#f5c6bf");
  }
}

function drawGums() {
  for (let g in gums) {
    drawGum(canvas.width / 2 - (player.x - gums[g].x), canvas.height / 2 - (player.y - gums[g].y), 8);
  }
}

function drawLB() {
  ctx.beginPath();
  ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
  ctx.fillRect(0, 0, 250, 350);
  ctx.textAlign = "left";
  ctx.fillStyle = "white";
  ctx.font = "bold 30px Poppins";
  ctx.fillText("Leaderboard", 20, 40);
  for (let l in lb) {
    ctx.fillStyle = "#eee";
    ctx.font = "21px Poppins";
    if (lb[l].isClient == true) {
      ctx.fillStyle = "#ffc414";
    }
    ctx.beginPath();
    const fit_name = fitText(lb[l].name, 150);
    const fit_score = reduce_num(lb[l].score, 2);
    ctx.fillText(`${fit_name}: ${fit_score}`, 20, 75 + 30 * l);
  }
}

function fitText(text, maxWidth) {
  const text_width = ctx.measureText(text).width;
  if (text_width > maxWidth) {
    for (let i = text.length - 1; i > 0; i--) {
      text = text.slice(0, -1);
      if (ctx.measureText(text).width < maxWidth) {
        return text + "...";
      }
    }
    return text;
  }
  return text;
}