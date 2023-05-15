from datetime import datetime
import pytz
from bson import ObjectId
from bson.binary import Binary
from fastapi import UploadFile
from beanie import Document
from fastapi_users.db import BeanieBaseUser
from fastapi_users import models
from typing import Callable


moscow_tz = pytz.timezone('Europe/Moscow')

class UserFile():
    def __init__(self, filename, user_id, content: dict[str, str], get_keywords: Callable[[str], list[str]]):
        self._id = ObjectId()
        self.user_id = user_id
        self.title = filename
        self.upload_date = datetime.now(moscow_tz)
        self.content = content
        self.keywords = get_keywords(' '.join(content.values()))
        self.preview = {'Направление': content['Направление'],
                        'Проект' : content['Название проекта'],}


class User(BeanieBaseUser, Document):
    email: str
    name: str
    surname: str
    hashed_password: str
    is_active: bool = True
    is_superuser: bool = False
    is_verified: bool = False
    projects: list[models.ID] = []
    applications: list[models.ID] = []


class Direction():
    def __init__(self, direction_name: str) -> None:
        self._id = ObjectId()
        self.name = direction_name