from app.core.config import DB_LINK, DB
from bson.objectid import ObjectId
import motor.motor_asyncio
from fastapi_users.db import BeanieUserDatabase
from .models import User

client = motor.motor_asyncio.AsyncIOMotorClient(
    DB_LINK, uuidRepresentation="standard"
)
db = client[DB]
users = db['User']
files = db['files']
applications = db['applications']

async def save_file(file):
    await applications.insert_one(file)
    await users.update_one({'_id' : file['user_id']}, {'$push' : {'applications' : file['_id']}})

async def accept_application(file_id):
    file = await applications.find_one_and_delete({'_id' : ObjectId(file_id)})
    await files.insert_one(file)
    user_id = file['user_id']
    await users.update_one({'_id' : user_id}, {'$pull' : {'applications' : ObjectId(file_id)}})
    await users.update_one({'_id' : user_id}, {'$push' : {'projects' : ObjectId(file_id)}})

async def reject_application(file_id):
    file = await applications.find_one_and_delete({'_id' : ObjectId(file_id)})
    await users.update_one({'_id' : file['user_id']}, {'$pull' : {'applications' : ObjectId(file_id)}})

async def get_file_content(file_id, isApplications = False):
    collection = get_collection(isApplications)
    return await collection.find_one({'_id': ObjectId(file_id)}, {'content': 1, '_id': 0})

async def get_files_content(isApplications = False):
    result = []
    collection = get_collection(isApplications)
    async for x in collection.find({}, {"_id": 1, "content": 1}):
        result.append(x)
    return result

def get_collection(isApplications):
    if isApplications:
        return applications
    return files

async def get_user_db():
    yield BeanieUserDatabase(User)
