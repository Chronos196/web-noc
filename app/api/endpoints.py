from fastapi import File, UploadFile, Request, APIRouter
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse

from app.db.db import save_file, get_file
from app.db.models import UserFile

from bson import json_util

from beanie import init_beanie
from fastapi import Depends, FastAPI

from app.db.db import User, db
from app.core.security.schemas import UserCreate, UserRead, UserUpdate
from app.core.security.auth import auth_backend, current_active_user, fastapi_users, current_active_superuser


templates = Jinja2Templates(directory="app/templates")

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
@app.post("/upload_file/")
async def upload_file(file: UploadFile = File(...), user: User = Depends(current_active_user)):
    file_size = file.file.seek(0, 2)
    file_size_mb = file_size / (1024 * 1024)
    file.file.seek(0)

    if file.filename == '':
        return {"status": "EmptyFile"}
    elif file_size_mb > 8:
        return {"status": "TooMuch", "filename": file.filename}
    else:
        user_file = UserFile(file, user.id)
        save_file(user_file.__dict__)
        return {"status": "Success", "filename": file.filename}


@app.get("/files/{file_id}")
async def read_file(file_id):
    data = get_file(file_id) 
    return json_util.dumps(data, ensure_ascii=False) ### Кавычки экранированы, пока не знаю как это решить


@app.on_event("startup")
async def on_startup():
    await init_beanie(
        database=db,
        document_models=[
            User,
        ],
    )