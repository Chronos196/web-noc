from fastapi import FastAPI
from app.api.endpoints import router

from uvicorn import Server, Config

app = FastAPI()
app.include_router(router)

server = Server(Config(app, host="127.0.0.1", port=8000))
server.run()
