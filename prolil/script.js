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

// Обработка платежа через Telegram Stars
async function handleDeposit() {
    try {
        const amount = prompt('Введите сумму в Stars (1 TFS = 2 Stars):');
        if (!amount || isNaN(amount) || amount <= 0) {
            window.Telegram.WebApp.showAlert('Пожалуйста, введите корректную сумму');
            return;
        }

        const depositData = {
            title: 'Пополнение баланса',
            description: 'Пополнение игрового баланса',
            amount: parseInt(amount) * 100 // Telegram ожидает сумму в минимальных единицах (центы)
        };

        const BACKEND_URL = 'http://localhost:5000'; // Замените на ваш бэкенд URL (например, ваш Flask-сервер)
        const response = await fetch(`${BACKEND_URL}/api/create-stars-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: depositData,
                telegram_id: queryParams.telegram_id
            })
        });

        if (!response.ok) throw new Error('Ошибка сервера');
        const { data } = await response.json();

        await window.Telegram.WebApp.openInvoice(data);

        window.Telegram.WebApp.onEvent('invoiceClosed', async (event) => {
            if (event.status === 'paid') {
                window.Telegram.WebApp.showPopup({
                    title: 'Успешно',
                    message: `Баланс пополнен на ${amount} Stars`
                });
                // Обновляем баланс через API
                await updateBalance(amount);
            } else if (event.status === 'failed') {
                window.Telegram.WebApp.showPopup({
                    title: 'Ошибка',
                    message: 'Платеж не прошел. Попробуйте позже'
                });
            }
        });
    } catch (error) {
        console.error('Payment error:', error);
        window.Telegram.WebApp.showAlert('Произошла ошибка при обработке платежа');
    }
}

// Обновление баланса через API
async function updateBalance(amount) {
    const BACKEND_URL = 'http://localhost:5000'; // Замените на ваш бэкенд URL
    try {
        const response = await fetch(`${BACKEND_URL}/api/update_balance/${queryParams.telegram_id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ betAmount: parseInt(amount) * 2 }) // 1 TFS = 2 Stars
        });
        if (response.ok) {
            const data = await response.json();
            const newBalance = data.newBalance;
            displayUserInfo(queryParams.username, newBalance);
        }
    } catch (error) {
        console.error('Balance update error:', error);
    }
}

// Инициализация
const queryParams = getQueryParams();
displayUserInfo(queryParams.username, queryParams.balance);

// Обработчики кнопок
document.getElementById('depositButton').addEventListener('click', handleDeposit);
document.getElementById('withdrawButton').addEventListener('click', () => {
    window.Telegram.WebApp.showAlert('Функция вывода пока не реализована');
});

// Проверка инициализации Telegram WebApp
if (!window.Telegram?.WebApp) {
    alert('Пожалуйста, откройте это приложение через Telegram');
} else {
    window.Telegram.WebApp.ready();
}