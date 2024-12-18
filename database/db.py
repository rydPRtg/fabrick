from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['telegramGame']
users_collection = db['users']

def get_user(telegram_id):
    return users_collection.find_one({'telegramId': telegram_id})

def create_user(telegram_id, username):
    user = {
        'telegramId': telegram_id,
        'username': username,
        'balance': 0
    }
    users_collection.insert_one(user)
    return user

def update_balance(telegram_id, amount):
    users_collection.update_one({'telegramId': telegram_id}, {'$inc': {'balance': amount}})
