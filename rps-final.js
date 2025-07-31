// Load score or set default
let score = JSON.parse(localStorage.getItem('score')) || {
  Wins: 0,
  Losses: 0,
  Ties: 0
};

updateScoreElement();

let isAutoplaying = false;
let intervalId;

// Event: Manual Buttons
document.querySelector('.js-rock-btn').addEventListener('click', () => playGame('Rock'));
document.querySelector('.js-paper-btn').addEventListener('click', () => playGame('Paper'));
document.querySelector('.js-scissors-btn').addEventListener('click', () => playGame('Scissors'));

// Event: Keyboard Shortcuts
document.body.addEventListener('keydown', (event) => {
  if (event.key === 'r') playGame('Rock');
  else if (event.key === 'p') playGame('Paper');
  else if (event.key === 's') playGame('Scissors');
  else if (event.key === 'a') autoPlay();
  else if (event.key === 'Backspace') showDialogBox();
});

// Event: Reset Button
document.querySelector('.reset-btn').addEventListener('click', () => {
  showDialogBox();
  stopAutoPlay(); // Stop autoplay if running
});

// Event: Auto Play Button
document.querySelector('.auto-play').addEventListener('click', () => autoPlay());

function playGame(playerMove) {
  const computerMove = pickComputerMove();
  let result = '';

  if (playerMove === computerMove) {
    result = 'Tie.';
  } else if (
    (playerMove === 'Rock' && computerMove === 'Scissors') ||
    (playerMove === 'Paper' && computerMove === 'Rock') ||
    (playerMove === 'Scissors' && computerMove === 'Paper')
  ) {
    result = 'You Win.';
  } else {
    result = 'You Lose.';
  }

  // Update score
  if (result === 'You Win.') score.Wins++;
  else if (result === 'You Lose.') score.Losses++;
  else score.Ties++;

  localStorage.setItem('score', JSON.stringify(score));
  updateScoreElement();

  // Show result
  document.querySelector('.js-result').textContent = result;
  document.querySelector('.js-moves').innerHTML = `
    You 
    <img src="images/${playerMove}-emoji.png" class="move-icon" alt="${playerMove}">
    <img src="images/${computerMove}-emoji.png" class="move-icon" alt="${computerMove}">
    Computer
  `;
}

function updateScoreElement() {
  document.querySelector('.js-score').textContent = 
    `Wins : ${score.Wins}, Losses : ${score.Losses}, Ties : ${score.Ties}`;
}

function pickComputerMove() {
  const moves = ['Rock', 'Paper', 'Scissors'];
  const randomIndex = Math.floor(Math.random() * moves.length);
  return moves[randomIndex];
}

function autoPlay() {
  if (!isAutoplaying) {
    intervalId = setInterval(() => {
      const playerMove = pickComputerMove();
      playGame(playerMove);
    }, 1000);
    isAutoplaying = true;
    document.querySelector('.auto-play').textContent = 'Stop Playing';
  } else {
    stopAutoPlay();
  }
}

function stopAutoPlay() {
  clearInterval(intervalId);
  isAutoplaying = false;
  document.querySelector('.auto-play').textContent = 'Auto Play';
}

function resetScore() {
  score = { Wins: 0, Losses: 0, Ties: 0 };
  localStorage.removeItem('score');
  updateScoreElement();
}

function showDialogBox() {
  const dialogBox = document.querySelector('.dialog-box');
  dialogBox.innerHTML = `
    <p class="js-reset-confirm">Are you sure? You want to reset score?</p>
    <div class="reset-btn-div">
      <button class="yes-btn reset-confirm-btn">Yes</button>
      <button class="no-btn reset-confirm-btn">No</button>
    </div>`;

  document.querySelector('.yes-btn').addEventListener('click', () => {
    resetScore();
    hideDialogBox();
    stopAutoPlay();
  });

  document.querySelector('.no-btn').addEventListener('click', () => {
    hideDialogBox();
    stopAutoPlay();
  });
}

function hideDialogBox() {
  document.querySelector('.dialog-box').innerHTML = '';
}
