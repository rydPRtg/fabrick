from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Создание базы данных SQLite
DATABASE_URL = "sqlite:///database/users.db"
engine = create_engine(DATABASE_URL)
Base = declarative_base()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Определение модели пользователя
class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    telegram_id = Column(Integer, unique=True, index=True)
    username = Column(String, index=True)
    balance = Column(Integer, default=0)

# Создание таблицы
Base.metadata.create_all(bind=engine)

# Функции для работы с базой данных
def get_user(session, telegram_id):
    return session.query(User).filter(User.telegram_id == telegram_id).first()

def create_user(session, telegram_id, username):
    user = User(telegram_id=telegram_id, username=username)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

def update_balance(session, telegram_id, amount):
    user = session.query(User).filter(User.telegram_id == telegram_id).first()
    if user:
        user.balance += amount
        session.commit()
        session.refresh(user)
    return user
