from pymongo import MongoClient
from app.core.config import DB_LINK, DB
from bson.objectid import ObjectId

cluster = MongoClient(DB_LINK)
db = cluster[DB]

users = db['users']
files = db['files']

def save_file_name(name):
    files.insert_one({'name': name})
