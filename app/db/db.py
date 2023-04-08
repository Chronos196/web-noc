from pymongo import MongoClient
from app.core.config import DB_LINK, DB
from bson.objectid import ObjectId

cluster = MongoClient(DB_LINK)
db = cluster[DB]

users = db['users']
files = db['files']

def save_file(file):
    files.insert_one(file)

def get_file(file_id):
    return files.find_one({'_id': ObjectId(file_id)})