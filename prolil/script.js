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
    document.getElementById('balance').innerText = `Баланс: ${balance} Stars`;
}

// Получаем параметры из URL и отображаем информацию о пользователе
const queryParams = getQueryParams();
displayUserInfo(queryParams.username, queryParams.balance);

// Telegram Web App API initialization
const telegram = window.Telegram.WebApp;

// Function to show payment modal
function showPaymentModal(starsAmount) {
    const modal = document.getElementById('paymentModal');
    const starsAmountElement = document.getElementById('starsAmount');
    starsAmountElement.innerText = starsAmount;
    modal.classList.add('show');
}

// Function to hide payment modal
function hidePaymentModal() {
    const modal = document.getElementById('paymentModal');
    modal.classList.remove('show');
}

// Handle deposit button click
document.getElementById('depositButton').addEventListener('click', () => {
    const starsAmount = 1333; // Example amount in Stars, match this with your screenshot
    showPaymentModal(starsAmount);
});

// Handle close button in modal
document.querySelector('.close-button').addEventListener('click', hidePaymentModal);

// Handle confirm payment button
document.getElementById('confirmPayment').addEventListener('click', () => {
    const starsAmount = parseInt(document.getElementById('starsAmount').innerText);

    // Define the invoice parameters for Telegram Stars payment
    const invoiceParams = {
        title: 'MemeFi Coin Purchase',
        description: `Purchase ${starsAmount} Stars for MemeFi Coin`,
        payload: 'memeFiCoinPurchase_' + Date.now(), // Unique payload for tracking
        provider_token: '', // Your payment provider token (if using a third-party provider)
        currency: 'XTR', // Telegram Stars use 'XTR' as currency code
        prices: [{ label: 'Stars', amount: starsAmount * 100 }], // Amount in cents (multiply by 100 for Stars)
        max_tip_amount: 0, // Optional, set to 0 if no tips allowed
        suggested_tip_amounts: [] // Optional, no tips suggested
    };

    // Use Telegram WebApp API to show the invoice
    telegram.showInvoice(invoiceParams)
        .then((result) => {
            if (result.success) {
                // Payment successful, update balance or notify user
                alert(`Платеж на ${starsAmount} Stars успешно выполнен!`);
                hidePaymentModal();
                // Update balance in your backend or UI here
                updateBalance(starsAmount);
            } else {
                alert('Платеж не выполнен. Попробуйте снова.');
            }
        })
        .catch((error) => {
            console.error('Error during payment:', error);
            alert('Произошла ошибка при оплате. Пожалуйста, попробуйте позже.');
        });
});

// Function to update balance (example, replace with your backend call)
function updateBalance(starsAmount) {
    // This is a placeholder. You would typically call your backend API here
    const currentBalance = parseInt(queryParams.balance) || 0;
    const newBalance = currentBalance + starsAmount;
    document.getElementById('balance').innerText = `Баланс: ${newBalance} Stars`;
    // Optionally, send the transaction to your server to record it
}