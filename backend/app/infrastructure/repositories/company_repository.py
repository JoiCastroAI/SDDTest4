import math
from uuid import UUID

from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.company import Company
from app.domain.repositories.company_repository import CompanyRepository
from app.infrastructure.database.models.company import CompanyModel


class SqlAlchemyCompanyRepository(CompanyRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_by_id(self, company_id: UUID) -> Company | None:
        result = await self._session.execute(
            select(CompanyModel).where(CompanyModel.id == company_id)
        )
        model = result.scalar_one_or_none()
        return self._to_entity(model) if model else None

    async def get_all(self, page: int = 1, page_size: int = 10) -> tuple[list[Company], int]:
        count_result = await self._session.execute(select(func.count()).select_from(CompanyModel))
        total = count_result.scalar_one()

        offset = (page - 1) * page_size
        result = await self._session.execute(
            select(CompanyModel).order_by(CompanyModel.name).offset(offset).limit(page_size)
        )
        models = result.scalars().all()
        return [self._to_entity(m) for m in models], total

    async def save(self, company: Company) -> Company:
        model = self._to_model(company)
        self._session.add(model)
        await self._session.flush()
        await self._session.refresh(model)
        return self._to_entity(model)

    async def update(self, company: Company) -> Company:
        result = await self._session.execute(
            select(CompanyModel).where(CompanyModel.id == company.id)
        )
        model = result.scalar_one_or_none()
        if model is None:
            raise ValueError(f"Company not found: {company.id}")

        model.name = company.name
        model.street = company.street
        model.city = company.city
        model.state = company.state
        model.zip_code = company.zip_code
        model.country = company.country
        model.revenue = company.revenue
        model.expenses = company.expenses
        model.employees = company.employees
        model.clients = company.clients

        await self._session.flush()
        await self._session.refresh(model)
        return self._to_entity(model)

    async def delete(self, company_id: UUID) -> None:
        result = await self._session.execute(
            select(CompanyModel).where(CompanyModel.id == company_id)
        )
        model = result.scalar_one_or_none()
        if model is not None:
            await self._session.delete(model)
            await self._session.flush()

    async def bulk_delete(self, ids: list[UUID]) -> None:
        if not ids:
            return
        await self._session.execute(
            delete(CompanyModel).where(CompanyModel.id.in_(ids))
        )
        await self._session.flush()

    async def get_by_name(self, name: str) -> Company | None:
        result = await self._session.execute(
            select(CompanyModel).where(CompanyModel.name == name)
        )
        model = result.scalar_one_or_none()
        return self._to_entity(model) if model else None

    @staticmethod
    def _to_entity(model: CompanyModel) -> Company:
        return Company(
            id=model.id,
            name=model.name,
            street=model.street,
            city=model.city,
            state=model.state,
            zip_code=model.zip_code,
            country=model.country,
            revenue=model.revenue,
            expenses=model.expenses,
            employees=model.employees,
            clients=model.clients,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

    @staticmethod
    def _to_model(entity: Company) -> CompanyModel:
        return CompanyModel(
            id=entity.id,
            name=entity.name,
            street=entity.street,
            city=entity.city,
            state=entity.state,
            zip_code=entity.zip_code,
            country=entity.country,
            revenue=entity.revenue,
            expenses=entity.expenses,
            employees=entity.employees,
            clients=entity.clients,
            created_at=entity.created_at,
            updated_at=entity.updated_at,
        )
