import os

import dotenv

dotenv.load_dotenv()

PORT = os.getenv("port") or "4999"
SQLALCHEMY_DATABASE_URI = os.getenv("sqlalchemy_database_uri")


def get():
    return dotenv.dotenv_values()


def set(key, value):
    dotenv.set_key(dotenv.find_dotenv(), key, value)
