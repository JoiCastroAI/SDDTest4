from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.schemas.company import (
    BulkDeleteRequest,
    CompanyResponse,
    CreateCompanyRequest,
    PaginatedCompanyResponse,
    UpdateCompanyRequest,
)
from app.application.use_cases.company_use_cases import (
    BulkDeleteCompaniesUseCase,
    CreateCompanyUseCase,
    DeleteCompanyUseCase,
    GetCompanyUseCase,
    ListCompaniesUseCase,
    UpdateCompanyUseCase,
)
from app.infrastructure.database.session import get_db
from app.infrastructure.repositories.company_repository import SqlAlchemyCompanyRepository

router = APIRouter(prefix="/companies", tags=["companies"])


def _get_repo(db: AsyncSession = Depends(get_db)) -> SqlAlchemyCompanyRepository:
    return SqlAlchemyCompanyRepository(db)


@router.get("", response_model=PaginatedCompanyResponse)
async def list_companies(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    repo: SqlAlchemyCompanyRepository = Depends(_get_repo),
) -> PaginatedCompanyResponse:
    use_case = ListCompaniesUseCase(repo)
    return await use_case.execute(page=page, page_size=page_size)


@router.get("/{company_id}", response_model=CompanyResponse)
async def get_company(
    company_id: UUID,
    repo: SqlAlchemyCompanyRepository = Depends(_get_repo),
) -> CompanyResponse:
    use_case = GetCompanyUseCase(repo)
    return await use_case.execute(company_id)


@router.post("", response_model=CompanyResponse, status_code=201)
async def create_company(
    body: CreateCompanyRequest,
    repo: SqlAlchemyCompanyRepository = Depends(_get_repo),
    db: AsyncSession = Depends(get_db),
) -> CompanyResponse:
    use_case = CreateCompanyUseCase(repo)
    result = await use_case.execute(body)
    await db.commit()
    return result


@router.put("/{company_id}", response_model=CompanyResponse)
async def update_company(
    company_id: UUID,
    body: UpdateCompanyRequest,
    repo: SqlAlchemyCompanyRepository = Depends(_get_repo),
    db: AsyncSession = Depends(get_db),
) -> CompanyResponse:
    use_case = UpdateCompanyUseCase(repo)
    result = await use_case.execute(company_id, body)
    await db.commit()
    return result


@router.delete("/{company_id}", status_code=204)
async def delete_company(
    company_id: UUID,
    repo: SqlAlchemyCompanyRepository = Depends(_get_repo),
    db: AsyncSession = Depends(get_db),
) -> None:
    use_case = DeleteCompanyUseCase(repo)
    await use_case.execute(company_id)
    await db.commit()


@router.delete("", status_code=204)
async def bulk_delete_companies(
    body: BulkDeleteRequest,
    repo: SqlAlchemyCompanyRepository = Depends(_get_repo),
    db: AsyncSession = Depends(get_db),
) -> None:
    use_case = BulkDeleteCompaniesUseCase(repo)
    await use_case.execute(body.ids)
    await db.commit()
