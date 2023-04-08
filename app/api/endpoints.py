from fastapi import File, UploadFile, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from fastapi import APIRouter

from app.db.db import save_file

from app.db.models import UserFile

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")


@router.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


'''
Максимальный размер BSON в монго составляет 16 Мбайт. Это можно исправить, но займусь этим потом
Пока сделаю ограничение размера файла в 8 Мбайт, т.к. кроме самого файла, BSON хранит
некоторую другую информацию
'''
@router.post("/upload_file/")
async def upload_file(file: UploadFile = File(...)):
    file_size = file.file.seek(0, 2)
    file_size_mb = file_size / (1024 * 1024)
    file.file.seek(0)
    
    if file.filename == '':
        return {"error": "Файл пустой"}
    elif file_size_mb > 8:
        return {"error": f"Файл {file.filename} слишком большой(более 8МБ)"}
    else:
        user_file = UserFile(file)
        save_file(user_file.__dict__)
        return {"message": f"Файл {file.filename} успешно загружен"}
