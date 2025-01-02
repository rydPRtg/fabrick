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
let userBalance = parseInt(queryParams.balance) || 0;
displayUserInfo(queryParams.username, userBalance);

const ICONS = [
    'apple', 'apricot', 'banana', 'big_win', 'cherry', 'grapes', 'lemon', 'lucky_seven', 'orange', 'pear', 'strawberry', 'watermelon',
];

/**
 * @type {number} The minimum spin time in seconds
 */
const BASE_SPINNING_DURATION = 2.7;

/**
 * @type {number} The additional duration to the base duration for each row (in seconds).
 * It makes the typical effect that the first reel ends, then the second, and so on...
 */
const COLUMN_SPINNING_DURATION = 0.3;

var cols;

window.addEventListener('DOMContentLoaded', function(event) {
    cols = document.querySelectorAll('.col');
    setInitialItems();
    fetchUserData(); // Fetch initial user data from the server
});

function setInitialItems() {
    let baseItemAmount = 40;

    for (let i = 0; i < cols.length; ++i) {
        let col = cols[i];
        let amountOfItems = baseItemAmount + (i * 3); // Increment the amount for each column
        let elms = '';
        let firstThreeElms = '';

        for (let x = 0; x < amountOfItems; x++) {
            let icon = getRandomIcon();
            let item = '<div class="icon" data-item="' + icon + '"><img src="items/' + icon + '.png"></div>';
            elms += item;

            if (x < 3) firstThreeElms += item; // Backup the first three items because the last three must be the same
        }
        col.innerHTML = elms + firstThreeElms;
    }
}

/**
 * Called when the start-button is pressed.
 *
 * @param elem The button itself
 */
function spin(elem) {
    const betAmount = parseInt(document.getElementById('bet-amount').value) || 0;

    if (betAmount <= 0) {
        alert('Сумма ставки должна быть больше нуля.');
        return;
    }

    if (betAmount > userBalance) {
        alert('Недостаточно средств на балансе.');
        return;
    }

    let duration = BASE_SPINNING_DURATION + randomDuration();

    for (let col of cols) { // set the animation duration for each column
        duration += COLUMN_SPINNING_DURATION + randomDuration();
        col.style.animationDuration = duration + "s";
    }

    // disable the start-button
    elem.setAttribute('disabled', true);

    // set the spinning class so the css animation starts to play
    document.getElementById('container').classList.add('spinning');

    // set the result delayed
    // this would be the right place to request the combination from the server
    window.setTimeout(setResult, BASE_SPINNING_DURATION * 1000 / 2);

    window.setTimeout(function () {
        // after the spinning is done, remove the class and enable the button again
        document.getElementById('container').classList.remove('spinning');
        elem.removeAttribute('disabled');

        // deduct the bet amount from the balance
        userBalance -= betAmount;
        updateBalanceOnServer(betAmount);
    }.bind(elem), duration * 1000);
}

/**
 * Sets the result items at the beginning and the end of the columns
 */
function setResult() {
    for (let col of cols) {
        // generate 3 random items
        let results = [
            getRandomIcon(),
            getRandomIcon(),
            getRandomIcon()
        ];

        let icons = col.querySelectorAll('.icon img');
        // replace the first and last three items of each column with the generated items
        for (let x = 0; x < 3; x++) {
            icons[x].setAttribute('src', 'items/' + results[x] + '.png');
            icons[(icons.length - 3) + x].setAttribute('src', 'items/' + results[x] + '.png');
        }
    }
}

function getRandomIcon() {
    return ICONS[Math.floor(Math.random() * ICONS.length)];
}

/**
 * @returns {number} 0.00 to 0.09 inclusive
 */
function randomDuration() {
    return Math.floor(Math.random() * 10) / 100;
}

// Функция для быстрого ввода суммы ставки
function quickBet(amount) {
    const betAmountInput = document.getElementById('bet-amount');
    const currentValue = parseInt(betAmountInput.value) || 0;
    const newValue = currentValue + amount;

    if (newValue > userBalance) {
        alert('Недостаточно средств на балансе.');
        return;
    }

    betAmountInput.value = newValue;
}

// Функция для обновления баланса на сервере
function updateBalanceOnServer(betAmount) {
    const telegramId = queryParams.telegram_id; // Use the actual Telegram ID of the user
    fetch(`/api/update_balance/${telegramId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ betAmount: betAmount })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            userBalance = data.newBalance;
            displayUserInfo(queryParams.username, userBalance);
        } else {
            alert('Ошибка при обновлении баланса.');
        }
    })
    .catch(error => {
        console.error('Error updating balance:', error);
    });
}

// Функция для получения данных пользователя с сервера
function fetchUserData() {
    const telegramId = queryParams.telegram_id; // Use the actual Telegram ID of the user
    fetch(`/api/user/${telegramId}`)
        .then(response => response.json())
        .then(data => {
            if (data.nickname && data.balance) {
                userBalance = data.balance;
                displayUserInfo(data.nickname, userBalance);
            } else {
                console.error('Invalid data format:', data);
            }
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
}
