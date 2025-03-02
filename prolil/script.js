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
        // Инициализация Telegram Web App
        const webApp = window.Telegram.WebApp;

        // Отправка запроса на оплату через Telegram Stars
        webApp.openInvoice(`https://t.me/$payment?amount=${starsAmount}`, (status) => {
            if (status === 'paid') {
                alert(`Оплата на ${starsAmount} Stars успешно завершена! Баланс пополнен на ${amount} TFS.`);
                // Здесь можно добавить логику обновления баланса через API
                depositModal.style.display = 'none';
                depositAmountInput.value = '';
            } else if (status === 'cancelled') {
                alert('Оплата была отменена.');
            } else if (status === 'failed') {
                alert('Ошибка при оплате. Попробуйте снова.');
            }
        });
    } else {
        alert('Этот функционал доступен только в Telegram Web App.');
    }
});