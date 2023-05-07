from datetime import datetime
import pytz
from bson import ObjectId
from bson.binary import Binary
from fastapi import UploadFile
from beanie import Document
from fastapi_users.db import BeanieBaseUser
from fastapi_users import models


moscow_tz = pytz.timezone('Europe/Moscow')

class UserFile():
    def __init__(self, file: UploadFile, user_id):
        self._id = ObjectId()
        self.title = file.filename
        self.upload_date = datetime.now(moscow_tz)
        self.type = file.content_type
        self.content = Binary(file.file.read())
        self.user_id = user_id
        self.is_approved = False

class User(BeanieBaseUser, Document):
    email: str
    hashed_password: str
    is_active: bool = True
    is_superuser: bool = False
    is_verified: bool = False
    projects: list[models.ID] = []
    applications: list[models.ID] = []