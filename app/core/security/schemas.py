from beanie import PydanticObjectId
from fastapi_users import schemas
from typing import Optional
from pydantic import EmailStr
from fastapi_users import models


class UserRead(schemas.BaseUser[PydanticObjectId]):
    id: models.ID
    email: EmailStr
    is_active: bool = True
    is_superuser: bool = False
    is_verified: bool = False


class UserCreate(schemas.BaseUserCreate):
    email: EmailStr
    password: str
    is_active: Optional[bool] = True
    is_superuser: Optional[bool] = False
    is_verified: Optional[bool] = False


class UserUpdate(schemas.BaseUserUpdate):
    password: Optional[str]
    email: Optional[EmailStr]
    is_active: Optional[bool]
    is_superuser: Optional[bool]
    is_verified: Optional[bool]
    projects: Optional[list[models.ID]]
    applications: Optional[list[models.ID]]