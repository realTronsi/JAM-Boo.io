function drawAmmo(n){
  ctx.beginPath();
  ctx.fillStyle = "#c7c7c7";
  ctx.arc(760, 525, 7, 0, Math.PI*2);
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = "#c7c7c7";
  ctx.arc(780, 525, 7, 0, Math.PI*2);
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = "#c7c7c7";
  ctx.arc(800, 525, 7, 0, Math.PI*2);
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = "#c7c7c7";
  ctx.arc(820, 525, 7, 0, Math.PI*2);
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = "#c7c7c7";
  ctx.arc(840, 525, 7, 0, Math.PI*2);
  ctx.fill();
  
  ctx.beginPath();
  if(n>=1){
    ctx.fillStyle = "#fea6ff";
  } else {
    ctx.fillStyle = "#5c5c5c";
  }
  ctx.arc(760, 525, 5, 0, Math.PI*2);
  ctx.fill();
  ctx.beginPath();
  if(n>=2){
    ctx.fillStyle = "#fea6ff";
  } else {
    ctx.fillStyle = "#5c5c5c";
  }
  ctx.arc(780, 525, 5, 0, Math.PI*2);
  ctx.fill();
  ctx.beginPath();
  if(n>=3){
    ctx.fillStyle = "#fea6ff";
  } else {
    ctx.fillStyle = "#5c5c5c";
  }
  ctx.arc(800, 525, 5, 0, Math.PI*2);
  ctx.fill();
  ctx.beginPath();
  if(n>=4){
    ctx.fillStyle = "#fea6ff";
  } else {
    ctx.fillStyle = "#5c5c5c";
  }
  ctx.arc(820, 525, 5, 0, Math.PI*2);
  ctx.fill();
  ctx.beginPath();
  if(n>=5){
    ctx.fillStyle = "#fea6ff";
  } else {
    ctx.fillStyle = "#5c5c5c";
  }
  ctx.arc(840, 525, 5, 0, Math.PI*2);
  ctx.fill();
}