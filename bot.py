import asyncio
import json
from aiogram import Bot, Dispatcher, types
from aiogram.types import Message, LabeledPrice, PreCheckoutQuery, ContentType
from aiogram.filters import CommandStart

TOKEN = '7210744291:AAGDpAr7dd5g_XdyZsdCvzTNGJeXP7bU0qQ'

# Создаем экземпляр бота
bot = Bot(token=TOKEN)
dp = Dispatcher()

# Обработчик команды /start
@dp.message(CommandStart(deep_link=True))
async def cmd_start(message: Message):
    # Парсим параметры из команды /start (например, /start deposit_20_123456789)
    start_param = message.get_args()
    if start_param.startswith('deposit_'):
        try:
            _, stars_amount, telegram_id = start_param.split('_')
            stars_amount = int(stars_amount)
            await bot.send_invoice(
                chat_id=message.chat.id,
                title='Пополнение баланса',
                description=f"Пополнение на {stars_amount // 2} TFS",
                payload=f"deposit_{telegram_id}_{stars_amount}",
                currency="XTR",
                prices=[LabeledPrice(label="Stars", amount=stars_amount)]
            )
        except ValueError:
            await message.answer("Ошибка в параметрах. Попробуйте снова.")
    else:
        await message.answer("Привет! Нажми 'Пополнить баланс' на сайте, чтобы начать.")

# Обработчик данных из Web App
@dp.message(content_types=ContentType.WEB_APP_DATA)
async def handle_web_app_data(message: types.Message):
    data = json.loads(message.web_app_data.data)
    if data.get('action') == 'deposit':
        stars_amount = int(data['amount'])
        telegram_id = data['telegram_id']
        await bot.send_invoice(
            chat_id=message.chat.id,
            title='Пополнение баланса',
            description=f"Пополнение на {stars_amount // 2} TFS",
            payload=f"deposit_{telegram_id}_{stars_amount}",
            currency="XTR",
            prices=[LabeledPrice(label="Stars", amount=stars_amount)]
        )

# Обработчик PreCheckoutQuery
@dp.pre_checkout_query()
async def pre_checkout_query(query: PreCheckoutQuery):
    await query.answer(ok=True)

# Обработчик успешной оплаты
@dp.message(content_types=ContentType.SUCCESSFUL_PAYMENT)
async def successful_payment(message: types.Message):
    payload = message.successful_payment.provider_payment_charge_id
    telegram_id = message.successful_payment.telegram_payment_charge_id.split('_')[1]  # Извлекаем telegram_id из payload
    stars_amount = int(message.successful_payment.total_amount)
    tfs_amount = stars_amount // 2
    await message.answer(f"Оплата на {stars_amount} Stars прошла успешно! Ваш баланс пополнен на {tfs_amount} TFS.")

# Основная функция для запуска бота
async def main():
    print("Бот запущен")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())