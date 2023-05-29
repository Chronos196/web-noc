from typing import Any, Optional, Coroutine

from beanie import PydanticObjectId

from fastapi import Depends, Request, Response
from fastapi_users import BaseUserManager

from fastapi_users.db import BeanieUserDatabase, ObjectIDIDMixin

from app.db.db import get_user_db
from app.db.models import User

from app.core.config import SECRET

from typing import Union

class UserManager(ObjectIDIDMixin, BaseUserManager[User, PydanticObjectId]):
    reset_password_token_secret = SECRET
    verification_token_secret = SECRET

    async def on_after_register(self, user: User, request: Optional[Request] = None):
        print(f"User {user.id} has registered.")

    async def on_after_forgot_password(
        self, user: User, token: str, request: Optional[Request] = None
    ):
        print(f"User {user.id} has forgot their password. Reset token: {token}")

    async def on_after_request_verify(
        self, user: User, token: str, request: Optional[Request] = None
    ):
        print(f"Verification requested for user {user.id}. Verification token: {token}")

    async def on_after_login(self, user: User, request: Union[Request, None] = None, response: Union[Response, None] = None) -> Coroutine[Any, Any, None]:
        print(user.email)
        return await super().on_after_login(user, request, response)


async def get_user_manager(user_db: BeanieUserDatabase = Depends(get_user_db)):
    yield UserManager(user_db)