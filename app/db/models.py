from datetime import datetime
import pytz
from bson import ObjectId
from beanie import Document
from fastapi_users.db import BeanieBaseUser
from fastapi_users import models

from app.api.textrank import FileParser

from typing import List

moscow_tz = pytz.timezone('Europe/Moscow')

class UserFile():
    def __init__(self, filename, user_id, direction_id, file_parser: FileParser):
        self._id = ObjectId()
        self.user_id = user_id
        self.direction_id = direction_id
        self.title = filename
        self.upload_date = datetime.now(moscow_tz)
        self.preview = file_parser.preview
        self.content = file_parser.content
        self.keywords = file_parser.keywords


class User(BeanieBaseUser, Document):
    email: str
    name: str
    surname: str
    hashed_password: str
    is_active: bool = True
    is_superuser: bool = False
    is_verified: bool = False
    projects: List[models.ID] = []
    applications: List[models.ID] = []


class Direction():
    def __init__(self, direction_name: str) -> None:
        self._id = ObjectId()
        self.name = direction_name
        self.projects = []
        self.applications = []