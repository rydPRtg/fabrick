const spinButton = document.getElementById('spinButton');
const messageElement = document.getElementById('message');
const wheel = document.querySelector('.wheel');
const ball = document.querySelector('.ball');
const betType = document.getElementById('betType');
const betNumber = document.getElementById('betNumber');
const betAmount = document.getElementById('betAmount');

betType.addEventListener('change', () => {
    if (betType.value === 'number') {
        betNumber.disabled = false;
    } else {
        betNumber.disabled = true;
    }
});

spinButton.addEventListener('click', () => {
    const spinDuration = 5; // Длительность вращения рулетки
    const randomRotation = Math.floor(Math.random() * 360) + 720; // Конечное положение рулетки

    wheel.style.transition = `transform ${spinDuration}s cubic-bezier(0.17, 0.67, 0.83, 0.67)`;
    wheel.style.transform = `rotate(${randomRotation}deg)`;

    setTimeout(() => {
        const winningSegment = Math.floor((360 - (randomRotation % 360)) / 9.23) % 37;
        const winningNumber = document.querySelectorAll('.number')[winningSegment].textContent;
        const winningColor = document.querySelectorAll('.number')[winningSegment].classList[1];

        let message = `Выпало число ${winningNumber}, цвет ${winningColor}`;

        if (betType.value === 'red' && winningColor === 'red') {
            message += ' - Вы выиграли!';
        } else if (betType.value === 'black' && winningColor === 'black') {
            message += ' - Вы выиграли!';
        } else if (betType.value === 'odd' && winningNumber % 2 !== 0) {
            message += ' - Вы выиграли!';
        } else if (betType.value === 'even' && winningNumber % 2 === 0) {
            message += ' - Вы выиграли!';
        } else if (betType.value === 'number' && betNumber.value == winningNumber) {
            message += ' - Вы выиграли!';
        } else {
            message += ' - Вы проиграли.';
        }

        messageElement.textContent = message;
    }, spinDuration * 1000);
});
