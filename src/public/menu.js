function joinLobby(){
  if(pl_c == true){
    error("Something went wrong, please reload");
  } else {
    const ws = new WebSocket("wss://JAM-Booio.realtronsi.repl.co");
    ws.binaryType = 'arraybuffer';
    main(ws);
  }
}

function error(msg){
  const error = document.getElementById("err_msg");
  error.innerHTML = msg;
}