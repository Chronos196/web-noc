from fastapi import File, UploadFile, Request, Depends, FastAPI, status, Response, Query
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse

from app.db.db import save_file, get_file_content, accept_application, reject_application, get_files_preview, get_user_files, get_directions, get_direction_id
from app.db.models import UserFile

from bson import json_util

from beanie import init_beanie

from app.db.db import User, db
from app.core.security.schemas import UserCreate, UserRead, UserUpdate
from app.core.security.auth import auth_backend, fastapi_users, current_active_superuser, current_active_default_user, current_active_user

from app.api.textrank import TextRank, FileParser

from starlette.responses import Response

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

@app.middleware("http")
async def modify_response(request, call_next):
    response = await call_next(request)
    if response.status_code == 401:
        if request.url.path == '/':
            response = templates.TemplateResponse("statistic.html", {"request": request}, status_code=401)
        elif request.url.path == '/statistic':
            response = templates.TemplateResponse("statistic.html",{"request": request}, status_code=401)
        elif request.url.path == '/noc':
            response = templates.TemplateResponse("noc.html",{"request": request}, status_code=401)
        elif request.url.path == '/incom_app':
            response = templates.TemplateResponse("incom_app.html",{"request": request}, status_code=401)
        elif request.url.path == '/projects':
            all_projects = await get_files()
            directions = await get_all_directions()
            response = templates.TemplateResponse("projects.html",{"request": request, "projects": json_util.loads(all_projects), "directions": json_util.loads(directions)}, status_code=401)
        elif request.url.path.startswith('/project/'):
            project = await read_file(request.url.path.split('/')[-1])
            response = templates.TemplateResponse("project.html",{"request": request, "project": json_util.loads(project)}, status_code=401)
    return response

@app.get("/", response_class=HTMLResponse)
async def root(request: Request, user: User = Depends(current_active_user)):
    return templates.TemplateResponse("statistic.html", {"request": request, "user": user})

@app.get("/statistic", response_class=HTMLResponse)
async def root(request: Request, user: User = Depends(current_active_user)):
    return templates.TemplateResponse("statistic.html", {"request": request, "user": user})

@app.get("/profile", response_class=HTMLResponse)
async def root(request: Request, user: User = Depends(current_active_user)):
    return templates.TemplateResponse("profile.html", {"request": request, "user": user})

@app.get("/noc", response_class=HTMLResponse)
async def root(request: Request, user: User = Depends(current_active_user)):
    return templates.TemplateResponse("noc.html", {"request": request, "user": user})

@app.get("/incom_app", response_class=HTMLResponse)
async def root(request: Request, user: User = Depends(current_active_user)):
    if user.is_superuser:
        incom_apps = await get_applications(user)
    else:
        incom_apps = await get_user_applications(user)
    return templates.TemplateResponse("incom_app.html", {"request": request, "user": user, "apps" : json_util.loads(incom_apps)})

@app.get("/projects", response_class=HTMLResponse)
async def root(request: Request, user: User = Depends(current_active_user)):
    all_projects = await get_files()
    directions = await get_all_directions()
    return templates.TemplateResponse("projects.html", {"request": request, "user": user, "projects": json_util.loads(all_projects), "directions": json_util.loads(directions)})

@app.get("/project/{project_id}", response_class=HTMLResponse)
async def root(project_id, request: Request, user: User = Depends(current_active_user)):
    project = await read_file(project_id)
    return templates.TemplateResponse("project.html", {"request": request, "user": user, "project": json_util.loads(project)})

@app.get("/appplication", response_class=HTMLResponse)
async def root( request: Request, app_id: str = Query(None), user: User = Depends(current_active_user)):
    try:
        application = await read_application(app_id)
        return templates.TemplateResponse("aplication.html", {"request": request, "user": user, "project": json_util.loads(application), "app_id": app_id})
    except:
        if user.is_superuser:
            incom_apps = await get_applications(user)
        else:
            incom_apps = await get_user_applications(user)
        return templates.TemplateResponse("incom_app.html", {"request": request, "user": user, "apps" : json_util.loads(incom_apps)})

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

    if file.filename == '' or file_size / 1024 == 0:
        return {"status": "EmptyFile"}
    elif not file.filename.endswith(".docx"):
        return {"status":"InvalidExtension", "filename":file.filename}
    elif file_size_mb > 8:
        return {"status": "TooMuch", "filename": file.filename}
    else:
        file_parser = FileParser(textRank.get_keywords, file)
        await file_parser.parse_file()
        direction_id = await get_direction_id(file_parser.preview['Направление'])
        user_file = UserFile(file.filename, user.id, direction_id, file_parser)
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
    data = await get_files_preview()
    return json_util.dumps(data, ensure_ascii=False) ### Кавычки экранированы, алекс пока не знает как это решить

@app.get("/applications/{application_id}")
async def read_application(application_id, user: User = Depends(current_active_user)):
    data = await get_file_content(application_id, True)
    return json_util.dumps(data, ensure_ascii=False) ### Кавычки экранированы, алекс пока не знает как это решить

@app.get("/applications/")
async def get_applications(user: User = Depends(current_active_superuser)):
    data = await get_files_preview(True)
    return json_util.dumps(data, ensure_ascii=False) ### Кавычки экранированы, алекс пока не знает как это решить

@app.get("/user-applications/")
async def get_user_applications(user: User = Depends(current_active_default_user)):
    data = await get_user_files(user.id, True)
    return json_util.dumps(data, ensure_ascii=False) ### Кавычки экранированы, алекс пока не знает как это решить

@app.get("/directions/")
async def get_all_directions():
    data = await get_directions()
    return json_util.dumps(data, ensure_ascii=False) ### Кавычки экранированы, алекс пока не знает как это решить

@app.on_event("startup")
async def on_startup():
    await init_beanie(
        database=db,
        document_models=[
            User,
        ],
    )