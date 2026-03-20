import math
from uuid import UUID

from app.application.schemas.company import (
    CompanyResponse,
    CreateCompanyRequest,
    PaginatedCompanyResponse,
    UpdateCompanyRequest,
)
from app.domain.entities.company import Company
from app.domain.exceptions import CompanyAlreadyExistsError, CompanyNotFoundError
from app.domain.repositories.company_repository import CompanyRepository


def _to_response(company: Company) -> CompanyResponse:
    return CompanyResponse(
        id=company.id,
        name=company.name,
        street=company.street,
        city=company.city,
        state=company.state,
        zip_code=company.zip_code,
        country=company.country,
        revenue=company.revenue,
        expenses=company.expenses,
        profit=company.profit,
        employees=company.employees,
        clients=company.clients,
        created_at=company.created_at,
        updated_at=company.updated_at,
    )


class ListCompaniesUseCase:
    def __init__(self, repo: CompanyRepository) -> None:
        self._repo = repo

    async def execute(self, page: int = 1, page_size: int = 10) -> PaginatedCompanyResponse:
        companies, total = await self._repo.get_all(page=page, page_size=page_size)
        total_pages = math.ceil(total / page_size) if total > 0 else 0
        return PaginatedCompanyResponse(
            items=[_to_response(c) for c in companies],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )


class GetCompanyUseCase:
    def __init__(self, repo: CompanyRepository) -> None:
        self._repo = repo

    async def execute(self, company_id: UUID) -> CompanyResponse:
        company = await self._repo.get_by_id(company_id)
        if company is None:
            raise CompanyNotFoundError(str(company_id))
        return _to_response(company)


class CreateCompanyUseCase:
    def __init__(self, repo: CompanyRepository) -> None:
        self._repo = repo

    async def execute(self, request: CreateCompanyRequest) -> CompanyResponse:
        existing = await self._repo.get_by_name(request.name)
        if existing is not None:
            raise CompanyAlreadyExistsError(request.name)

        company = Company(
            name=request.name,
            street=request.street,
            city=request.city,
            state=request.state,
            zip_code=request.zip_code,
            country=request.country,
            revenue=request.revenue,
            expenses=request.expenses,
            employees=request.employees,
            clients=request.clients,
        )
        saved = await self._repo.save(company)
        return _to_response(saved)


class UpdateCompanyUseCase:
    def __init__(self, repo: CompanyRepository) -> None:
        self._repo = repo

    async def execute(self, company_id: UUID, request: UpdateCompanyRequest) -> CompanyResponse:
        company = await self._repo.get_by_id(company_id)
        if company is None:
            raise CompanyNotFoundError(str(company_id))

        if request.name != company.name:
            existing = await self._repo.get_by_name(request.name)
            if existing is not None:
                raise CompanyAlreadyExistsError(request.name)

        company.name = request.name
        company.street = request.street
        company.city = request.city
        company.state = request.state
        company.zip_code = request.zip_code
        company.country = request.country
        company.revenue = request.revenue
        company.expenses = request.expenses
        company.employees = request.employees
        company.clients = request.clients

        updated = await self._repo.update(company)
        return _to_response(updated)


class DeleteCompanyUseCase:
    def __init__(self, repo: CompanyRepository) -> None:
        self._repo = repo

    async def execute(self, company_id: UUID) -> None:
        company = await self._repo.get_by_id(company_id)
        if company is None:
            raise CompanyNotFoundError(str(company_id))
        await self._repo.delete(company_id)


class BulkDeleteCompaniesUseCase:
    def __init__(self, repo: CompanyRepository) -> None:
        self._repo = repo

    async def execute(self, ids: list[UUID]) -> None:
        await self._repo.bulk_delete(ids)
