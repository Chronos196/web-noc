import os

_mongo_user = os.environ["MONGO_USER"]
_mongo_password = os.environ["MONGO_PASSWORD"]

DB_LINK = f'mongodb+srv://{_mongo_user}:{_mongo_password}@cluster0.ojeeimb.mongodb.net/?retryWrites=true&w=majority'
DB = os.environ['DB']

SECRET = "SECRET"