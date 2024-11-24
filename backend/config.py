# backend/config.py

import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", f"sqlite:///{os.path.join(os.getcwd(), 'devices.db')}")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
