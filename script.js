(function () {
  'use strict';

  const WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  const boardEl = document.getElementById('board');
  const cells = Array.from(document.querySelectorAll('.cell'));
  const statusEl = document.getElementById('status');
  const restartBtn = document.getElementById('restartBtn');
  const resetScoreBtn = document.getElementById('resetScoreBtn');
  const modeButtons = Array.from(document.querySelectorAll('.mode-btn'));
  const difficultyWrap = document.getElementById('difficultyWrap');
  const difficultySelect = document.getElementById('difficulty');
  const scoreXEl = document.getElementById('scoreX');
  const scoreOEl = document.getElementById('scoreO');
  const scoreDrawEl = document.getElementById('scoreDraw');
  const scoreXCard = document.getElementById('scoreXCard');
  const scoreOCard = document.getElementById('scoreOCard');
  const labelX = document.getElementById('labelX');
  const labelO = document.getElementById('labelO');

  let board = Array(9).fill(null);
  let currentPlayer = 'X';
  let gameActive = true;
  let mode = 'pvp'; // 'pvp' or 'pvc'
  let scores = { X: 0, O: 0, draw: 0 };
  const HUMAN = 'X';
  const AI = 'O';

  function init() {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    gameActive = true;
    cells.forEach((cell) => {
      cell.textContent = '';
      cell.className = 'cell';
      cell.disabled = false;
    });
    updateStatus();
    updateTurnHighlight();
  }

  function updateStatus(message) {
    if (message) {
      statusEl.textContent = message;
      return;
    }
    if (mode === 'pvc' && currentPlayer === AI) {
      statusEl.textContent = "Computer's turn...";
    } else {
      statusEl.textContent = `Player ${currentPlayer}'s turn`;
    }
    statusEl.classList.remove('win');
  }

  function updateTurnHighlight() {
    scoreXCard.classList.toggle('turn-active', currentPlayer === 'X' && gameActive);
    scoreOCard.classList.toggle('turn-active', currentPlayer === 'O' && gameActive);
  }

  function checkWinner(b) {
    for (const line of WIN_LINES) {
      const [a, c, d] = line;
      if (b[a] && b[a] === b[c] && b[a] === b[d]) {
        return { winner: b[a], line };
      }
    }
    if (b.every((v) => v !== null)) {
      return { winner: 'draw', line: null };
    }
    return null;
  }

  function handleCellClick(e) {
    const index = Number(e.currentTarget.dataset.index);
    if (!gameActive || board[index] !== null) return;
    if (mode === 'pvc' && currentPlayer !== HUMAN) return;

    makeMove(index, currentPlayer);

    const result = checkWinner(board);
    if (result) {
      endGame(result);
      return;
    }

    switchPlayer();

    if (mode === 'pvc' && currentPlayer === AI && gameActive) {
      updateStatus();
      updateTurnHighlight();
      setTimeout(computerMove, 400);
    }
  }

  function makeMove(index, player) {
    board[index] = player;
    const cell = cells[index];
    cell.textContent = player;
    cell.classList.add(player.toLowerCase(), 'pop');
    cell.disabled = true;
  }

  function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();
    updateTurnHighlight();
  }

  function endGame(result) {
    gameActive = false;
    cells.forEach((c) => (c.disabled = true));

    if (result.winner === 'draw') {
      statusEl.textContent = "It's a draw!";
      scores.draw += 1;
      scoreDrawEl.textContent = scores.draw;
    } else {
      const winnerLabel =
        mode === 'pvc' && result.winner === AI ? 'Computer wins!' : `Player ${result.winner} wins!`;
      statusEl.textContent = winnerLabel;
      statusEl.classList.add('win');
      scores[result.winner] += 1;
      if (result.winner === 'X') scoreXEl.textContent = scores.X;
      else scoreOEl.textContent = scores.O;

      result.line.forEach((i) => cells[i].classList.add('win-cell'));
    }
    scoreXCard.classList.remove('turn-active');
    scoreOCard.classList.remove('turn-active');
  }

  function computerMove() {
    if (!gameActive) return;
    const difficulty = difficultySelect.value;
    let index;

    if (difficulty === 'easy') {
      index = randomMove();
    } else if (difficulty === 'medium') {
      index = Math.random() < 0.5 ? randomMove() : bestMove();
    } else {
      index = bestMove();
    }

    if (index === undefined || index === null) return;

    makeMove(index, AI);
    const result = checkWinner(board);
    if (result) {
      endGame(result);
      return;
    }
    switchPlayer();
  }

  function randomMove() {
    const available = board.reduce((acc, v, i) => {
      if (v === null) acc.push(i);
      return acc;
    }, []);
    return available[Math.floor(Math.random() * available.length)];
  }

  function bestMove() {
    let bestScore = -Infinity;
    let move = null;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = AI;
        const score = minimax(board, 0, false);
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  }

  function minimax(b, depth, isMaximizing) {
    const result = checkWinner(b);
    if (result) {
      if (result.winner === AI) return 10 - depth;
      if (result.winner === HUMAN) return depth - 10;
      return 0;
    }

    if (isMaximizing) {
      let best = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (b[i] === null) {
          b[i] = AI;
          best = Math.max(best, minimax(b, depth + 1, false));
          b[i] = null;
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < 9; i++) {
        if (b[i] === null) {
          b[i] = HUMAN;
          best = Math.min(best, minimax(b, depth + 1, true));
          b[i] = null;
        }
      }
      return best;
    }
  }

  function setMode(newMode) {
    mode = newMode;
    modeButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.mode === mode));
    difficultyWrap.classList.toggle('hidden', mode !== 'pvc');
    labelO.textContent = mode === 'pvc' ? 'Computer' : 'Player O';
    resetScores();
    init();
  }

  function resetScores() {
    scores = { X: 0, O: 0, draw: 0 };
    scoreXEl.textContent = '0';
    scoreOEl.textContent = '0';
    scoreDrawEl.textContent = '0';
  }

  cells.forEach((cell) => cell.addEventListener('click', handleCellClick));
  restartBtn.addEventListener('click', init);
  resetScoreBtn.addEventListener('click', () => {
    resetScores();
    init();
  });
  modeButtons.forEach((btn) => {
    btn.addEventListener('click', () => setMode(btn.dataset.mode));
  });
  difficultySelect.addEventListener('change', () => {
    // No-op besides storing value; picked up on next computer move.
  });

  init();
})();
