from beanie import PydanticObjectId
from fastapi_users import FastAPIUsers
from fastapi_users.authentication import (
    AuthenticationBackend,
    JWTStrategy,
    CookieTransport
)

from app.db.models import User

from app.core.config import SECRET

from .user_manager import get_user_manager


cookie_transport = CookieTransport(cookie_name="noc", cookie_max_age=3600, cookie_samesite='lax')


def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=SECRET, lifetime_seconds=3600)


auth_backend = AuthenticationBackend(
    name="jwt",
    transport=cookie_transport,
    get_strategy=get_jwt_strategy,
)

fastapi_users = FastAPIUsers[User, PydanticObjectId](get_user_manager, [auth_backend])

current_active_user = fastapi_users.current_user()

current_active_superuser = fastapi_users.current_user(active=True, superuser=True)