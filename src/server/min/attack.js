function attackPaths(n, dir){
  dir = parseFloat(dir);
  if(n==1){
    return [dir];
  } else if(n==2){
    const offset = 15 * (Math.PI/180);
    return [dir-offset, dir+offset];
  } else if(n==3){
    const offset = 15 * (Math.PI/180);
    return [dir, dir-offset, dir+offset];
  } else if(n==4){
    const offset = 15 * (Math.PI/180);
    return [dir-offset/2, dir-offset*1.5, dir+offset/2, dir+offset*1.5];
  } else if(n==5){
    const offset = 15 * (Math.PI/180);
    return [dir, dir-offset, dir-offset*2, dir+offset, dir+offset*2];
  }
  return [];
}

module.exports = attackPaths;