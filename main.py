from fastapi import FastAPI
from app.api.endpoints import router
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from uvicorn import Server, Config

app = FastAPI()
app.include_router(router)

app.mount("/static", StaticFiles(directory="app/static"), name="static")

server = Server(Config(app, host="127.0.0.1", port=8000))
server.run()
