// Tetris Game Logic
(function() {
  // High score storage for Tetris
  function getTetrisHighScore() {
    return parseInt(localStorage.getItem('tetrisHighScore')||'0',10);
  }
  function setTetrisHighScore(val) {
    localStorage.setItem('tetrisHighScore', val);
  }
  const canvas = document.getElementById('tetris-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const COLS = 10, ROWS = 20, BLOCK = 20;
  let board = Array.from({length:ROWS},()=>Array(COLS).fill(0));
  const COLORS = [null, '#e74c3c', '#f1c40f', '#2ecc40', '#3498db', '#9b59b6', '#e67e22', '#1abc9c'];
  const SHAPES = [
    [],
    [[1,1,1,1]], // I
    [[2,2],[2,2]], // O
    [[0,3,0],[3,3,3]], // T
    [[4,0,0],[4,4,4]], // J
    [[0,0,5],[5,5,5]], // L
    [[6,6,0],[0,6,6]], // S
    [[0,7,7],[7,7,0]]  // Z
  ];
  let piece, pos, next, gameOver=false, score=0, running=false, interval=null;
  let tetrisHighScore = getTetrisHighScore();

  function updateScoreboard() {
    var score = document.getElementById('tetris-score');
    var high = document.getElementById('tetris-highscore');
    if(score) score.textContent = score;
    if(high) high.textContent = tetrisHighScore;
  }
  function resetTetris() {
    board = Array.from({length:ROWS},()=>Array(COLS).fill(0));
    piece = randomPiece();
    pos = {x:3, y:0};
    next = randomPiece();
    gameOver = false;
    score = 0;
    tetrisHighScore = getTetrisHighScore();
  }
  function randomPiece() {
    const id = Math.floor(Math.random()*7)+1;
    return { id, shape: SHAPES[id] };
  }
  function collide(p, px, py) {
    for(let y=0;y<p.shape.length;y++){
      for(let x=0;x<p.shape[y].length;x++){
        if(p.shape[y][x] && (board[py+y] && board[py+y][px+x]) ) return true;
        if(p.shape[y][x] && (px+x<0 || px+x>=COLS || py+y>=ROWS)) return true;
      }
    }
    return false;
  }
  function merge() {
    for(let y=0;y<piece.shape.length;y++){
      for(let x=0;x<piece.shape[y].length;x++){
        if(piece.shape[y][x]) board[pos.y+y][pos.x+x]=piece.id;
      }
    }
  }
  function rotate(shape) {
    return shape[0].map((_,i)=>shape.map(row=>row[i])).reverse();
  }
  function drop() {
    if(!gameOver && running){
      pos.y++;
      if(collide(piece,pos.x,pos.y)){
        pos.y--;
        merge();
        clearLines();
        piece=next; next=randomPiece(); pos={x:3,y:0};
        if(collide(piece,pos.x,pos.y)) gameOver=true;
      }
    }
  }
  function move(dir) {
    if(!gameOver && running){
      pos.x+=dir;
      if(collide(piece,pos.x,pos.y)) pos.x-=dir;
    }
  }
  function rotatePiece() {
    if(!gameOver && running){
      const newShape=rotate(piece.shape);
      if(!collide({id:piece.id,shape:newShape},pos.x,pos.y)) piece.shape=newShape;
    }
  }
  function clearLines() {
    let lines=0;
    for(let y=ROWS-1;y>=0;y--){
      if(board[y].every(v=>v)){
        board.splice(y,1);
        board.unshift(Array(COLS).fill(0));
        lines++;
      }
    }
    if(lines) {
      score+=lines*10;
      if(score > tetrisHighScore) {
        tetrisHighScore = score;
        setTetrisHighScore(tetrisHighScore);
      }
    }
  }
  function draw() {
    ctx.fillStyle='#222';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    // Draw board
    for(let y=0;y<ROWS;y++){
      for(let x=0;x<COLS;x++){
        if(board[y][x]){
          ctx.fillStyle=COLORS[board[y][x]];
          ctx.fillRect(x*BLOCK,y*BLOCK,BLOCK-2,BLOCK-2);
        }
      }
    }
    // Draw piece
    for(let y=0;y<piece.shape.length;y++){
      for(let x=0;x<piece.shape[y].length;x++){
        if(piece.shape[y][x]){
          ctx.fillStyle=COLORS[piece.id];
          ctx.fillRect((pos.x+x)*BLOCK,(pos.y+y)*BLOCK,BLOCK-2,BLOCK-2);
        }
      }
    }
    // Draw score
    ctx.fillStyle='#fff';
    ctx.font='16px Inter, sans-serif';
    ctx.fillText('Score: '+score,8,20);
    updateScoreboard();
    if(gameOver){
      ctx.fillStyle='rgba(0,0,0,0.7)';
      ctx.fillRect(0,canvas.height/2-30,canvas.width,60);
      ctx.fillStyle='#fff';
      ctx.font='24px Inter, sans-serif';
      ctx.textAlign='center';
      ctx.fillText('Game Over',canvas.width/2,canvas.height/2);
      ctx.font='16px Inter, sans-serif';
      ctx.fillText('Tap or press any key to restart',canvas.width/2,canvas.height/2+24);
      ctx.textAlign='left';
    }
  }
  function gameLoop() {
    if(!gameOver && running) drop();
    draw();
  }
  function startGame() {
    if (!running) {
      running = true;
      if (!interval) interval = setInterval(gameLoop, 400);
    }
  }
  function pauseGame() {
    running = false;
  }
  function stopGame() {
    running = false;
    resetTetris();
    draw();
  }
  function restartGame() {
    resetTetris();
    running = true;
    if (!interval) interval = setInterval(gameLoop, 400);
  }
  // Menu button events
  document.getElementById('tetris-start').onclick = startGame;
  document.getElementById('tetris-pause').onclick = pauseGame;
  document.getElementById('tetris-stop').onclick = stopGame;
  document.getElementById('tetris-restart').onclick = restartGame;
  // Keyboard controls
  document.addEventListener('keydown', function(e){
    if(gameOver) { restartGame(); return; }
    if(e.key==='ArrowLeft') move(-1);
    else if(e.key==='ArrowRight') move(1);
    else if(e.key==='ArrowDown') drop();
    else if(e.key==='ArrowUp') rotatePiece();
  });
  // Touch controls
  var tetrisBtns = {
    left: document.getElementById('tetris-left'),
    rotate: document.getElementById('tetris-rotate'),
    right: document.getElementById('tetris-right'),
    down: document.getElementById('tetris-down')
  };
  tetrisBtns.left.addEventListener('click', ()=>move(-1));
  tetrisBtns.right.addEventListener('click', ()=>move(1));
  tetrisBtns.down.addEventListener('click', ()=>drop());
  tetrisBtns.rotate.addEventListener('click', ()=>rotatePiece());
  canvas.addEventListener('touchstart', function(e){ if(gameOver){restartGame();} });
  canvas.addEventListener('mousedown', function(e){ if(gameOver){restartGame();} });
  // Reset on game switch
  var gameSelect = document.getElementById('game-select');
  gameSelect.addEventListener('change', function() { if(this.value==='tetris'){ stopGame(); } });
  // Initial draw
  resetTetris();
  draw();
})();
