from fastapi import Request
from fastapi.responses import JSONResponse

from app.domain.exceptions import (
    DomainException,
    EntityAlreadyExistsError,
    EntityNotFoundError,
)


async def domain_exception_handler(request: Request, exc: DomainException) -> JSONResponse:
    if isinstance(exc, EntityNotFoundError):
        return JSONResponse(status_code=404, content={"detail": str(exc)})
    if isinstance(exc, EntityAlreadyExistsError):
        return JSONResponse(status_code=409, content={"detail": str(exc)})
    return JSONResponse(status_code=400, content={"detail": str(exc)})
