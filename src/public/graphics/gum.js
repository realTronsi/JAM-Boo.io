function drawGum(x, y, size){
  x = parseFloat(x);
  y = parseFloat(y);
  ctx.beginPath();
  ctx.fillStyle = "#fbc2fc";
  ctx.arc(x, y, size, 0, Math.PI*2);
  ctx.fill();
}