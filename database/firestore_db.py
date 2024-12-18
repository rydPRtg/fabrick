import firebase_admin
from firebase_admin import credentials, firestore

# Инициализация Firebase
cred = credentials.Certificate('database/casipr-82b1d-firebase-adminsdk-ev2t8-7c62257106.json')  # Обновите путь к вашему JSON-файлу
firebase_admin.initialize_app(cred)

db = firestore.client()

def get_user(telegram_id):
    doc_ref = db.collection('users').document(str(telegram_id))
    doc = doc_ref.get()
    if doc.exists:
        return doc.to_dict()
    return None

def create_user(telegram_id, username):
    doc_ref = db.collection('users').document(str(telegram_id))
    doc_ref.set({
        'telegramId': telegram_id,
        'username': username,
        'balance': 0
    })
    return get_user(telegram_id)

def update_balance(telegram_id, amount):
    doc_ref = db.collection('users').document(str(telegram_id))
    doc_ref.update({'balance': firestore.Increment(amount)})
