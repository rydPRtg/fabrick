// Функция для получения параметров из URL
function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    username: params.get("username"),
    balance: params.get("balance"),
    telegram_id: params.get("telegram_id"),
  };
}

// Функция для отображения информации о пользователе
function displayUserInfo(username, balance) {
  document.getElementById("username").innerText = `Никнейм: ${username}`;
  document.getElementById("balance").innerText = `Баланс: ${balance}`;
}

// Получаем параметры из URL и отображаем информацию о пользователе
const queryParams = getQueryParams();
displayUserInfo(queryParams.username, queryParams.balance);

// Логика для модального окна пополнения баланса
const depositButton = document.getElementById("depositButton");
const depositModal = document.getElementById("depositModal");
const closeButton = document.querySelector(".close-button");
const confirmDepositButton = document.getElementById("confirmDeposit");
const depositAmountInput = document.getElementById("depositAmount");

depositButton.addEventListener("click", () => {
  depositModal.style.display = "flex";
});

closeButton.addEventListener("click", () => {
  depositModal.style.display = "none";
});

confirmDepositButton.addEventListener("click", async () => {
  const amount = depositAmountInput.value;
  if (amount && amount > 0) {
    try {
      // Отправляем запрос на сервер для генерации инвойса
      const response = await fetch("http://localhost:3000/generate-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          userId: queryParams.telegram_id, // Передаем ID пользователя
        }),
      });

      const data = await response.json();

      if (data.invoiceLink) {
        // Открываем ссылку на инвойс через Telegram Mini App SDK
        Telegram.WebApp.openInvoice(data.invoiceLink, (status) => {
          if (status === "paid") {
            alert("Оплата прошла успешно!");
            depositModal.style.display = "none";
          } else {
            alert("Оплата не была завершена.");
          }
        });
      } else {
        alert("Не удалось создать инвойс.");
      }
    } catch (error) {
      console.error("Ошибка при создании инвойса:", error);
      alert("Произошла ошибка при создании инвойса.");
    }
  } else {
    alert("Пожалуйста, введите корректную сумму.");
  }
});

// Закрытие модального окна при клике вне его
window.addEventListener("click", (event) => {
  if (event.target === depositModal) {
    depositModal.style.display = "none";
  }
});
