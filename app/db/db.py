from pymongo import MongoClient
from app.core.config import DB_LINK, DB


cluster = MongoClient(DB_LINK)
db = cluster[DB]

users = db['users']
