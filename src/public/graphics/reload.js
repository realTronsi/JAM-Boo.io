function drawReloadBar(n){
  n = Math.abs(parseInt(n));
  ctx.beginPath();
  ctx.lineCap = "round";
  ctx.lineWidth = 30;
  ctx.strokeStyle = "rgba(150, 150, 150, 0.7)"
  ctx.moveTo(500, 800);
  ctx.lineTo(1100, 800);
  ctx.stroke();
  ctx.beginPath();
  ctx.lineCap = "round";
  ctx.lineWidth = 27;
  ctx.strokeStyle = "rgba(255, 199, 59, 0.8)"
  ctx.moveTo(500, 800);
  ctx.lineTo(500+((n/300)*600), 800);
  ctx.stroke();
  ctx.lineCap = "butt";
}