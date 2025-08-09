// Pong Game Logic
(function() {
  // High score storage for Pong
  function getPongHighScore() {
    return parseInt(localStorage.getItem('pongHighScore')||'0',10);
  }
  function setPongHighScore(val) {
    localStorage.setItem('pongHighScore', val);
  }
  const canvas = document.getElementById('pong-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = 320, H = 320;
  let paddleH = 60, paddleW = 10;
  let playerY = H/2 - paddleH/2;
  let aiY = H/2 - paddleH/2;
  let ball = { x: W/2, y: H/2, vx: 3, vy: 2, r: 8 };
  let playerScore = 0, aiScore = 0;
  let upPressed = false, downPressed = false;
  let gameOver = false;
  let running = false;
  let interval = null;
  let pongHighScore = getPongHighScore();

  function updateScoreboard() {
    var score = document.getElementById('pong-score');
    var high = document.getElementById('pong-highscore');
    if(score) score.textContent = playerScore;
    if(high) high.textContent = pongHighScore;
  }
  function resetBall() {
    ball.x = W/2; ball.y = H/2;
    ball.vx = (Math.random() > 0.5 ? 3 : -3);
    ball.vy = (Math.random() > 0.5 ? 2 : -2);
  }
  function resetGame() {
    playerY = H/2 - paddleH/2;
    aiY = H/2 - paddleH/2;
    playerScore = 0; aiScore = 0;
    pongHighScore = getPongHighScore();
    gameOver = false;
    resetBall();
  }
  function draw() {
    ctx.fillStyle = '#222';
    ctx.fillRect(0,0,W,H);
    // Net
    ctx.strokeStyle = '#fff';
    ctx.setLineDash([6,6]);
    ctx.beginPath(); ctx.moveTo(W/2,0); ctx.lineTo(W/2,H); ctx.stroke(); ctx.setLineDash([]);
    // Paddles
    ctx.fillStyle = '#fff';
    ctx.fillRect(10, playerY, paddleW, paddleH);
    ctx.fillRect(W-20, aiY, paddleW, paddleH);
    // Ball
    ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, 2*Math.PI); ctx.fill();
    // Score
    ctx.font = '20px Inter, sans-serif';
    ctx.fillText(playerScore, W/2-40, 30);
    ctx.fillText(aiScore, W/2+20, 30);
    updateScoreboard();
    if(gameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(0,H/2-30,W,60);
      ctx.fillStyle = '#fff';
      ctx.font = '24px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over', W/2, H/2);
      ctx.font = '16px Inter, sans-serif';
      ctx.fillText('Tap or press any key to restart', W/2, H/2+24);
      ctx.textAlign = 'left';
    }
  }
  function update() {
    if(gameOver || !running) return;
    // Player move
    if(upPressed) playerY -= 5;
    if(downPressed) playerY += 5;
    playerY = Math.max(0, Math.min(H-paddleH, playerY));
    // AI move
    if(ball.y < aiY + paddleH/2) aiY -= 3;
    else if(ball.y > aiY + paddleH/2) aiY += 3;
    aiY = Math.max(0, Math.min(H-paddleH, aiY));
    // Ball move
    ball.x += ball.vx; ball.y += ball.vy;
    // Collisions
    if(ball.y-ball.r < 0 || ball.y+ball.r > H) ball.vy *= -1;
    // Player paddle
    if(ball.x-ball.r < 20 && ball.y > playerY && ball.y < playerY+paddleH) ball.vx *= -1;
    // AI paddle
    if(ball.x+ball.r > W-20 && ball.y > aiY && ball.y < aiY+paddleH) ball.vx *= -1;
    // Score
    if(ball.x < 0) { aiScore++; resetBall(); }
    if(ball.x > W) {
      playerScore++;
      if(playerScore > pongHighScore) {
        pongHighScore = playerScore;
        setPongHighScore(pongHighScore);
      }
      resetBall();
    }
  }
  function gameLoop() {
    update();
    draw();
  }
  function startGame() {
    if (!running) {
      running = true;
      if (!interval) interval = setInterval(gameLoop, 1000/60);
    }
  }
  function pauseGame() {
    running = false;
  }
  function stopGame() {
    running = false;
    resetGame();
    draw();
  }
  function restartGame() {
    resetGame();
    running = true;
    if (!interval) interval = setInterval(gameLoop, 1000/60);
  }
  // Menu button events
  document.getElementById('pong-start').onclick = startGame;
  document.getElementById('pong-pause').onclick = pauseGame;
  document.getElementById('pong-stop').onclick = stopGame;
  document.getElementById('pong-restart').onclick = restartGame;
  // Keyboard controls
  document.addEventListener('keydown', function(e) {
    if(gameOver) { restartGame(); return; }
    if(e.key==='ArrowUp') upPressed = true;
    if(e.key==='ArrowDown') downPressed = true;
  });
  document.addEventListener('keyup', function(e) {
    if(e.key==='ArrowUp') upPressed = false;
    if(e.key==='ArrowDown') downPressed = false;
  });
  // Touch controls
  var pongBtns = {
    up: document.getElementById('pong-up'),
    down: document.getElementById('pong-down')
  };
  pongBtns.up.addEventListener('touchstart', ()=>{ upPressed = true; });
  pongBtns.up.addEventListener('touchend', ()=>{ upPressed = false; });
  pongBtns.down.addEventListener('touchstart', ()=>{ downPressed = true; });
  pongBtns.down.addEventListener('touchend', ()=>{ downPressed = false; });
  pongBtns.up.addEventListener('mousedown', ()=>{ upPressed = true; });
  pongBtns.up.addEventListener('mouseup', ()=>{ upPressed = false; });
  pongBtns.down.addEventListener('mousedown', ()=>{ downPressed = true; });
  pongBtns.down.addEventListener('mouseup', ()=>{ downPressed = false; });
  canvas.addEventListener('touchstart', function(e){ if(gameOver){restartGame();} });
  canvas.addEventListener('mousedown', function(e){ if(gameOver){restartGame();} });
  // Reset on game switch
  var gameSelect = document.getElementById('game-select');
  gameSelect.addEventListener('change', function() { if(this.value==='pong'){ stopGame(); } });
  // Initial draw
  resetGame();
  draw();
})();
