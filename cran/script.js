const gameField = document.getElementById('game-field');
const result = document.getElementById('result');

// Создание сетки 5x5
for (let i = 0; i < 25; i++) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  gameField.appendChild(cell);
}

// Клетки, в которых будут шарики
const cells = document.querySelectorAll('.cell');
const ballPositions = [];

// Рандомно размещаем 5 шариков
while (ballPositions.length < 5) {
  const randomIndex = Math.floor(Math.random() * 25);
  if (!ballPositions.includes(randomIndex)) {
    ballPositions.push(randomIndex);
    const ball = document.createElement('div');
    ball.classList.add('ball');
    ball.textContent = '?';
    cells[randomIndex].appendChild(ball);
  }
}

// Начальная позиция клешни
let cranePosition = 12; // Центральная клетка (индекс 12)
const crane = document.createElement('div');
crane.classList.add('crane');
cells[cranePosition].appendChild(crane);

// Движение клешни
function moveCrane(direction) {
  cells[cranePosition].removeChild(crane);

  if (direction === 'left' && cranePosition % 5 !== 0) cranePosition -= 1;
  if (direction === 'right' && cranePosition % 5 !== 4) cranePosition += 1;
  if (direction === 'up' && cranePosition >= 5) cranePosition -= 5;
  if (direction === 'down' && cranePosition < 20) cranePosition += 5;

  cells[cranePosition].appendChild(crane);
}

// События кнопок
document.getElementById('move-left').addEventListener('click', () => moveCrane('left'));
document.getElementById('move-right').addEventListener('click', () => moveCrane('right'));
document.getElementById('move-up').addEventListener('click', () => moveCrane('up'));
document.getElementById('move-down').addEventListener('click', () => moveCrane('down'));

// Попытка захвата шарика
document.getElementById('grab').addEventListener('click', () => {
  const cell = cells[cranePosition];
  const ball = cell.querySelector('.ball');

  if (ball) {
    const success = Math.random() > 0.5; // Успех с вероятностью 50%
    if (success) {
      ball.remove();
      result.textContent = 'Вы поймали шарик!';
    } else {
      result.textContent = 'Шарик выскользнул!';
    }
  } else {
    result.textContent = 'Здесь нет шарика!';
  }
});
