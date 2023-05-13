from fastapi import File, UploadFile, Request, Depends, FastAPI, status, Response
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse

from app.db.db import save_file, get_file_content, accept_application, reject_application, get_files_content, get_user_files
from app.db.models import UserFile

from bson import json_util

from beanie import init_beanie

from app.db.db import User, db
from app.core.security.schemas import UserCreate, UserRead, UserUpdate
from app.core.security.auth import auth_backend, fastapi_users, current_active_superuser, current_active_default_user, current_active_user

from app.api.textrank import TextRank

import re


templates = Jinja2Templates(directory="app/templates")
textRank = TextRank()
app = FastAPI()

app.include_router(
    fastapi_users.get_auth_router(auth_backend), 
    prefix="/auth/jwt", 
    tags=["auth"]
)
app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_reset_password_router(),
    prefix="/auth",
    tags=["auth"],
)
app.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)


@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/statistic", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse("statistic.html", {"request": request})

@app.get("/profile", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse("profile.html", {"request": request})

@app.get("/noc", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse("noc.html", {"request": request})

@app.get("/incom_app", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse("incom_app.html", {"request": request})

@app.get("/projects", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse("projects.html", {"request": request})

'''
Максимальный размер BSON в монго составляет 16 Мбайт. Это можно исправить, но займусь этим потом
Пока сделаю ограничение размера файла в 8 Мбайт, т.к. кроме самого файла, BSON хранит
некоторую другую информацию
'''
@app.post("/upload_file/", status_code=400)
async def upload_file(response: Response, file: UploadFile = File(...), user: User = Depends(current_active_default_user)):
    file_size = file.file.seek(0, 2)
    file_size_mb = file_size / (1024 * 1024)
    file.file.seek(0)

    if re.search(r'\.[^\.]*$', file.filename).group() != '.txt':
        return {"status":"InvalidExtension", "filename":file.filename}
    elif file.filename == '' or file_size / 1024 == 0:
        return {"status": "EmptyFile"}
    elif file_size_mb > 8:
        return {"status": "TooMuch", "filename": file.filename}
    else:
        user_file = UserFile(file, user.id, textRank.get_keywords)
        await save_file(user_file.__dict__)
        response.status_code = status.HTTP_201_CREATED
        return {"status": "Success", "filename": file.filename}
    
@app.put("/accept_file/{file_id}", status_code=200)
async def accept_file(file_id, user: User = Depends(current_active_superuser)):
    await accept_application(file_id)
    return {"status": "Success"}

@app.delete("/reject_file/{file_id}", status_code=200)
async def reject_file(file_id, user: User = Depends(current_active_superuser)):
    await reject_application(file_id)
    return {"status": "Success"}

@app.get("/files/{file_id}")
async def read_file(file_id):
    data = await get_file_content(file_id)
    return json_util.dumps(data, ensure_ascii=False) ### Кавычки экранированы, алекс пока не знает как это решить

@app.get("/files/")
async def get_files():
    data = await get_files_content()
    return json_util.dumps(data, ensure_ascii=False) ### Кавычки экранированы, алекс пока не знает как это решить

@app.get("/applications/{application_id}")
async def read_application(application_id, user: User = Depends(current_active_user)):
    data = await get_file_content(application_id, True)
    return json_util.dumps(data, ensure_ascii=False) ### Кавычки экранированы, алекс пока не знает как это решить

@app.get("/applications/")
async def get_applications(user: User = Depends(current_active_superuser)):
    data = await get_files_content(True)
    return json_util.dumps(data, ensure_ascii=False) ### Кавычки экранированы, алекс пока не знает как это решить

@app.get("/user-applications")
async def get_user_applications(user: User = Depends(current_active_default_user)):
    data = await get_user_files(user.id, True)
    return json_util.dumps(data, ensure_ascii=False) ### Кавычки экранированы, алекс пока не знает как это решить

@app.on_event("startup")
async def on_startup():
    await init_beanie(
        database=db,
        document_models=[
            User,
        ],
    )