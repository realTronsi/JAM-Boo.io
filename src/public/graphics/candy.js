function drawCandy(x, y, size, color, color2) {
  ctx.beginPath()
  x = parseFloat(x);
  y = parseFloat(y);
  size = parseFloat(size);
  ctx.fillStyle = color2;
  ctx.moveTo(x - size*0.8, y);
  ctx.lineTo(x - size*2, y-size);
  ctx.lineTo(x - size*2, y+size);
  ctx.lineTo(x - size*0.8, y);
  ctx.fill();
  ctx.beginPath()
  ctx.fillStyle = color2;
  ctx.moveTo(x + size*0.8, y);
  ctx.lineTo(x + size*2, y-size);
  ctx.lineTo(x + size*2, y+size);
  ctx.lineTo(x + size*0.8, y);
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
}