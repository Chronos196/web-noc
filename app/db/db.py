from app.core.config import DB_LINK, DB
from bson.objectid import ObjectId
import motor.motor_asyncio
from fastapi_users.db import BeanieUserDatabase
from .models import User

client = motor.motor_asyncio.AsyncIOMotorClient(
    DB_LINK, uuidRepresentation="standard"
)
db = client[DB]

users = db['users']
files = db['files']

def save_file(file):
    files.insert_one(file)

def get_file(file_id):
    return files.find_one({'_id': ObjectId(file_id)})


async def get_user_db():
    yield BeanieUserDatabase(User)