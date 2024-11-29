const reelSymbols = ["🍒", "🍋", "🍊", "🍉", "⭐", "🔔"];
const spinButton = document.getElementById("spinButton");
const reels = [
    document.getElementById("reel1"),
    document.getElementById("reel2"),
    document.getElementById("reel3"),
];

let isSpinning = false;

function spinReels() {
    if (isSpinning) return;
    isSpinning = true;
    spinButton.disabled = true;

    const stopTimes = [1000, 2000, 3000]; // Время остановки каждого барабана
    const results = [];

    reels.forEach((reel, index) => {
        let interval = setInterval(() => {
            const randomSymbol = reelSymbols[Math.floor(Math.random() * reelSymbols.length)];
            reel.textContent = randomSymbol;
        }, 100); // Скорость вращения

        setTimeout(() => {
            clearInterval(interval);
            const finalSymbol = reelSymbols[Math.floor(Math.random() * reelSymbols.length)];
            reel.textContent = finalSymbol;
            results.push(finalSymbol);

            // Когда все барабаны остановились
            if (results.length === reels.length) {
                isSpinning = false;
                spinButton.disabled = false;
                checkResult(results);
            }
        }, stopTimes[index]);
    });
}

function checkResult(results) {
    const [first, second, third] = results;
    if (first === second && second === third) {
        alert(`Поздравляем! Вы выиграли с комбинацией ${first}!`);
    } else {
        alert("Увы, попробуйте ещё раз!");
    }
}

spinButton.addEventListener("click", spinReels);