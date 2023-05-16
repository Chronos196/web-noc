from app.core.config import DB_LINK, DB
from bson.objectid import ObjectId
import motor.motor_asyncio
from fastapi_users.db import BeanieUserDatabase
from .models import User, Direction

client = motor.motor_asyncio.AsyncIOMotorClient(
    DB_LINK, uuidRepresentation="standard"
)
db = client[DB]
users = db['User']
files = db['files']
applications = db['applications']
directions = db['directions']

async def save_file(file):
    await applications.insert_one(file)
    await users.update_one({'_id' : file['user_id']}, {'$push' : {'applications' : file['_id']}})
    await directions.update_one({'_id': file['direction_id']}, {'$push' : {'applications' : file['_id']}})

async def get_direction_id(direction_name):
    direction = await directions.find_one({'name': direction_name})
    if direction:
        return direction['_id']
    direction = Direction(direction_name)
    await directions.insert_one(direction.__dict__)
    return direction._id

async def get_directions():
    result = []
    async for dir in directions.find({}, {'_id': 0, 'name' : 1}):
        result.append(dir)
    return result

async def accept_application(file_id):
    file = await applications.find_one_and_delete({'_id' : ObjectId(file_id)})
    await files.insert_one(file)
    user_id = file['user_id']
    direction_id = file['direction_id']
    await users.update_one({'_id' : user_id}, {'$pull' : {'applications' : ObjectId(file_id)}})
    await users.update_one({'_id' : user_id}, {'$push' : {'projects' : ObjectId(file_id)}})
    await directions.update_one({'_id' : direction_id}, {'$pull' : {'applications' : ObjectId(file_id)}})
    await directions.update_one({'_id' : direction_id}, {'$push' : {'projects' : ObjectId(file_id)}})

async def reject_application(file_id):
    file = await applications.find_one_and_delete({'_id' : ObjectId(file_id)})
    await users.update_one({'_id' : file['user_id']}, {'$pull' : {'applications' : ObjectId(file_id)}})
    direction = await directions.find_one({'_id': file['direction_id']})
    if direction['projects'] == [] and len(direction['applications']) == 1:
        await directions.delete_one({'_id': direction['_id']})
    else:
        await directions.update_one({'_id' : direction['_id']}, {'$pull' : {'applications' : ObjectId(file_id)}})

async def get_file_content(file_id, isApplications = False):
    collection = get_collection(isApplications)
    return await collection.find_one({'_id': ObjectId(file_id)}, {'content': 1, 'keywords': 1, '_id': 0})

async def get_files_preview(isApplications = False):
    result = []
    collection = get_collection(isApplications)
    async for x in collection.find({}, {"_id": 1, "preview": 1}):
        result.append(x)
    return result

async def get_user_files(user_id, isApplications = False):
    result = []
    collection = get_collection(isApplications)
    async for x in collection.find({'user_id' : ObjectId(user_id)}, {'preview': 1, '_id' : 1}):
        result.append(x)
    return result

def get_collection(isApplications):
    if isApplications:
        return applications
    return files

async def get_user_db():
    yield BeanieUserDatabase(User)
