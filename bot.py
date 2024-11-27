import asyncio
from aiogram import Bot, Dispatcher, Router, types
from aiogram.types import WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.filters import Command
from config import BOT_TOKEN, WEBAPP_URL

# Инициализация бота, диспетчера и роутера
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()
router = Router()

# Регистрация обработчика команды /start
@router.message(Command("start"))
async def start_command(message: types.Message):
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
        "Нажмите кнопку ниже, чтобы начать игру!",
        reply_markup=reply_keyboard
    )
    await message.answer(
        "Или вы можете нажать эту кнопку:",
        reply_markup=inline_keyboard
    )

# Главная асинхронная функция
async def main():
    # Регистрация роутера в диспетчере
    dp.include_router(router)
    print("Бот запущен")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
