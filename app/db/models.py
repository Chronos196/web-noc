from datetime import datetime
from bson import ObjectId
from bson.binary import Binary
from fastapi import UploadFile

class UserFile():
    def __init__(self, file: UploadFile):
        self._id = ObjectId()
        self.title = file.filename
        self.upload_date = datetime.now()
        self.type = file.content_type
        self.content = Binary(file.file.read())
        ###self.user_id = ObjectId()
