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

// Элементы модального окна
const depositButton = document.getElementById('depositButton');
const depositModal = document.getElementById('depositModal');
const closeButton = document.querySelector('.close-button');
const payWithStarsButton = document.getElementById('payWithStars');
const depositAmountInput = document.getElementById('depositAmount');

// Открытие модального окна
depositButton.addEventListener('click', () => {
    depositModal.style.display = 'flex';
});

// Закрытие модального окна
closeButton.addEventListener('click', () => {
    depositModal.style.display = 'none';
    depositAmountInput.value = ''; // Очищаем поле ввода
});

// Закрытие модального окна при клике вне его
window.addEventListener('click', (event) => {
    if (event.target === depositModal) {
        depositModal.style.display = 'none';
        depositAmountInput.value = '';
    }
});

// Логика оплаты через Telegram Stars
payWithStarsButton.addEventListener('click', () => {
    const amount = parseInt(depositAmountInput.value);
    if (!amount || amount <= 0) {
        alert('Пожалуйста, введите корректную сумму!');
        return;
    }

    // Конвертация TFS в Stars (1 TFS = 2 Stars)
    const starsAmount = amount * 2;

    // Проверка, запущено ли приложение в Telegram Web App
    if (window.Telegram && window.Telegram.WebApp) {
        const webApp = window.Telegram.WebApp;
        // Отправляем данные боту через WebApp
        webApp.sendData(JSON.stringify({
            action: 'deposit',
            amount: starsAmount,
            telegram_id: queryParams.telegram_id
        }));
        depositModal.style.display = 'none';
        depositAmountInput.value = '';
    } else {
        // Если не в Web App, перенаправляем к боту с параметрами
        const botUsername = '@raidwar_bot'; // Замените на имя вашего бота, например, @MyPaymentBot
        window.location.href = `https://t.me/${botUsername}?start=deposit_${starsAmount}_${queryParams.telegram_id}`;
    }
});