function drawGhost(x, y, size, color) {
  ctx.beginPath();
  x = parseFloat(x);
  y = parseFloat(y);
  size = parseFloat(size);
  ctx.fillStyle = color;
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath()
  ctx.moveTo(x - size, y);
  ctx.lineTo(x - size, y + size * 1.5);
  ctx.lineTo(x - size / 2, y + size);
  ctx.lineTo(x, y + size * 1.5);
  ctx.lineTo(x + size * 0.5, y + size);
  ctx.lineTo(x + size, y + size * 1.5);
  ctx.lineTo(x + size, y);
  ctx.fill();
  ctx.beginPath()
  ctx.fillStyle = "black";
  ctx.arc(x - size / 2.5, y, size / 4, 0, Math.PI * 2);
  ctx.arc(x + size / 2.5, y, size / 4, 0, Math.PI * 2);
  ctx.fill()
}