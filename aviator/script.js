document.addEventListener('DOMContentLoaded', function() {
    const placeBetButton = document.getElementById('place-bet');
    const cashOutButton = document.getElementById('cash-out');
    const exitButton = document.getElementById('exit-button');
    const planeContainer = document.getElementById('plane-container');
    const plane = document.getElementById('plane');
    const multiplier = document.getElementById('multiplier');
    const trail = document.getElementById('trail');
    const betAmountInput = document.getElementById('bet-amount');
    let gameInterval;
    let multiplierValue = 1.00;
    let isGameRunning = false;

    placeBetButton.addEventListener('click', function() {
        if (!isGameRunning) {
            const betAmount = parseFloat(betAmountInput.value);
            if (betAmount > 0) {
                startGame();
                placeBetButton.disabled = true;
                cashOutButton.disabled = false;
            } else {
                alert('Please enter a valid bet amount.');
            }
        }
    });

    cashOutButton.addEventListener('click', function() {
        if (isGameRunning) {
            stopGame();
            const betAmount = parseFloat(betAmountInput.value);
            const winnings = betAmount * multiplierValue;
            alert(`You cashed out at ${multiplierValue.toFixed(2)}x! You won $${winnings.toFixed(2)}`);
            resetGame();
        }
    });

    exitButton.addEventListener('click', function() {
        window.location.href = '../index.html'; // Перенаправление на casi/index.html
    });

    function startGame() {
        isGameRunning = true;
        multiplierValue = 1.00;
        planeContainer.style.left = '0';
        planeContainer.style.bottom = '50%';
        planeContainer.style.transform = 'translateY(50%)';
        trail.style.width = '0';
        trail.style.left = '0';
        trail.style.bottom = '50%';
        trail.style.transform = 'translateY(50%)';
        gameInterval = setInterval(updateGame, 100); // Увеличиваем интервал для медленного полета
    }

    function stopGame() {
        isGameRunning = false;
        clearInterval(gameInterval);
    }

    function resetGame() {
        stopGame();
        multiplier.textContent = '1.00x';
        planeContainer.style.left = '0';
        planeContainer.style.bottom = '50%';
        planeContainer.style.transform = 'translateY(50%)';
        trail.style.width = '0';
        trail.style.left = '0';
        trail.style.bottom = '50%';
        trail.style.transform = 'translateY(50%)';
        placeBetButton.disabled = false;
        cashOutButton.disabled = true;
    }

    function updateGame() {
        if (multiplierValue >= 10 || multiplierValue <= 0.1) {
            stopGame();
            alert(`The plane reached the maximum height at ${multiplierValue.toFixed(2)}x!`);
            resetGame();
            return;
        }

        // Обновляем множитель
        const increment = (Math.random() < 0.5) ? 0.01 : -0.01;
        multiplierValue += increment;
        multiplierValue = Math.max(0.1, Math.min(10, multiplierValue)); // Ограничиваем множитель
        multiplier.textContent = multiplierValue.toFixed(2) + 'x';

        // Обновляем позицию самолета
        const planeLeft = (multiplierValue * 100) + 'px'; // Увеличиваем скорость полета вправо
        const planeBottom = (150 + (multiplierValue - 1) * 100) + 'px'; // Увеличиваем амплитуду подъема и опускания
        planeContainer.style.left = planeLeft;
        planeContainer.style.bottom = planeBottom;
        planeContainer.style.transform = 'translateY(0)';

        // Обновляем позицию и размер красной полосы
        const trailWidth = planeLeft; // Увеличиваем ширину полосы
        trail.style.width = trailWidth;
        trail.style.bottom = planeBottom;
        trail.style.transform = 'translateY(0)';

        // Вероятность падения самолета увеличивается с высотой
        const crashProbability = Math.random();
        if (crashProbability < (1 - (1 / multiplierValue))) {
            stopGame();
            alert(`The plane crashed at ${multiplierValue.toFixed(2)}x!`);
            resetGame();
        }
    }
});
