from beanie import PydanticObjectId
from fastapi_users import schemas
from typing import Optional
from pydantic import EmailStr
from fastapi_users import models

from typing import List


class UserRead(schemas.BaseUser[PydanticObjectId]):
    id: models.ID
    email: EmailStr
    name: str
    surname: str
    is_active: bool = True
    is_superuser: bool = False
    is_verified: bool = False


class UserCreate(schemas.BaseUserCreate):
    email: EmailStr
    name: str
    surname: str
    password: str



class UserUpdate(schemas.BaseUserUpdate):
    password: Optional[str]
    email: Optional[EmailStr]
    name: Optional[str]
    surname: Optional[str]
    is_active: Optional[bool]
    is_superuser: Optional[bool]
    is_verified: Optional[bool]
    projects: Optional[List[models.ID]]
    applications: Optional[List[models.ID]]