from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.middleware import domain_exception_handler
from app.api.routers.company_router import router as company_router
from app.config import settings
from app.domain.exceptions import DomainException


app = FastAPI(title="FastReport API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(DomainException, domain_exception_handler)  # type: ignore[arg-type]

app.include_router(company_router)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
