from abc import ABC, abstractmethod
from uuid import UUID

from app.domain.entities.company import Company


class CompanyRepository(ABC):
    @abstractmethod
    async def get_by_id(self, company_id: UUID) -> Company | None: ...

    @abstractmethod
    async def get_all(self, page: int = 1, page_size: int = 10) -> tuple[list[Company], int]: ...

    @abstractmethod
    async def save(self, company: Company) -> Company: ...

    @abstractmethod
    async def update(self, company: Company) -> Company: ...

    @abstractmethod
    async def delete(self, company_id: UUID) -> None: ...

    @abstractmethod
    async def bulk_delete(self, ids: list[UUID]) -> None: ...

    @abstractmethod
    async def get_by_name(self, name: str) -> Company | None: ...
