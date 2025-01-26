// Функция для получения параметров из URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        username: params.get('username'),
        balance: params.get('balance'),
        telegram_id: params.get('telegram_id')
    };
}

// Функция для отображения информации о пользователе
function displayUserInfo(username, balance) {
    document.getElementById('username').innerText = `Никнейм: ${username}`;
    document.getElementById('balance').innerText = `Баланс: ${balance}`;
}

// Получаем параметры из URL и отображаем информацию о пользователе
const queryParams = getQueryParams();
displayUserInfo(queryParams.username, queryParams.balance);

// Реализация кнопок выхода
document.getElementById("exitButton1Container").addEventListener("click", () => {
    window.location.href = `slot2/index.html?username=${queryParams.username}&balance=${queryParams.balance}&telegram_id=${queryParams.telegram_id}`;
});

document.getElementById("exitButton2Container").addEventListener("click", () => {
    window.location.href = `ruletka/index.html?username=${queryParams.username}&balance=${queryParams.balance}&telegram_id=${queryParams.telegram_id}`;
});

document.getElementById("exitButton3Container").addEventListener("click", () => {
    window.location.href = `aviator/index.html?username=${queryParams.username}&balance=${queryParams.balance}&telegram_id=${queryParams.telegram_id}`;
});

// Открытие модального окна при нажатии на кнопку "Профиль"
document.getElementById("profileButton").addEventListener("click", () => {
    document.getElementById("modal").style.display = "block";
});

// Закрытие модального окна при нажатии на крестик
document.getElementsByClassName("close-button")[0].addEventListener("click", () => {
    document.getElementById("modal").style.display = "none";
});

// Закрытие модального окна при нажатии вне его
window.addEventListener("click", (event) => {
    if (event.target == document.getElementById("modal")) {
        document.getElementById("modal").style.display = "none";
    }
});
