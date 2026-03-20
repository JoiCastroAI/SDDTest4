from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field


class CreateCompanyRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    street: str | None = None
    city: str | None = None
    state: str | None = None
    zip_code: str | None = None
    country: str | None = None
    revenue: Decimal = Decimal("0")
    expenses: Decimal = Decimal("0")
    employees: int = 0
    clients: int = 0


class UpdateCompanyRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    street: str | None = None
    city: str | None = None
    state: str | None = None
    zip_code: str | None = None
    country: str | None = None
    revenue: Decimal = Decimal("0")
    expenses: Decimal = Decimal("0")
    employees: int = 0
    clients: int = 0


class CompanyResponse(BaseModel):
    id: UUID
    name: str
    street: str | None
    city: str | None
    state: str | None
    zip_code: str | None
    country: str | None
    revenue: Decimal
    expenses: Decimal
    profit: Decimal
    employees: int
    clients: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class PaginatedCompanyResponse(BaseModel):
    items: list[CompanyResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class BulkDeleteRequest(BaseModel):
    ids: list[UUID]
