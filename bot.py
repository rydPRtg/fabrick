import asyncio
from aiogram import Bot, Dispatcher, types
from aiogram.types import WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.dispatcher.filters import CommandStart, Command
from config import BOT_TOKEN, WEBAPP_URL
from database.firestore_db import get_user, create_user, update_balance

# Инициализация бота и диспетчера
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher(bot)

# Регистрация обработчика команды /start
@dp.message_handler(CommandStart())
async def start_command(message: types.Message):
    telegram_id = message.from_user.id
    username = message.from_user.username or message.from_user.full_name

    user = get_user(telegram_id)
    if not user:
        user = create_user(telegram_id, username)

    # Создаем обычную клавиатуру с кнопкой WebApp
    reply_keyboard = types.ReplyKeyboardMarkup(
        keyboard=[
            [types.KeyboardButton(text="Открыть игру", web_app=WebAppInfo(url=WEBAPP_URL))]
        ],
        resize_keyboard=True
    )

    # Создаем Inline-клавиатуру с кнопкой WebApp
    inline_keyboard = InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="Играть прямо сейчас", web_app=WebAppInfo(url=WEBAPP_URL))]
        ]
    )

    # Отправляем сообщение с Reply-клавиатурой и Inline-кнопкой
    await message.answer(
        f"Привет, {username}! Ваш баланс: {user['balance']}",
        reply_markup=reply_keyboard
    )
    await message.answer(
        "Или вы можете нажать эту кнопку:",
        reply_markup=inline_keyboard
    )

# Пример команды для обновления баланса
@dp.message_handler(Command("update_balance"))
async def update_balance_command(message: types.Message):
    telegram_id = message.from_user.id
    update_balance(telegram_id, 100)  # Пример увеличения баланса на 100
    user = get_user(telegram_id)
    await message.answer(f"Ваш новый баланс: {user['balance']}")

# Главная асинхронная функция
async def main():
    print("Бот запущен")
    await dp.start_polling()

if __name__ == "__main__":
    asyncio.run(main())
