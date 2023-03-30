from fastapi import File, UploadFile, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from fastapi import APIRouter

from app.db.db import save_file_name


router = APIRouter()
templates = Jinja2Templates(directory="app/templates")


@router.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@router.post("/upload_file/")
async def upload_file(file: UploadFile = File(...)):
    file_name = file.filename
    save_file_name(file_name)
    return {"message": f"Файл {file_name} успешно загружен"}
