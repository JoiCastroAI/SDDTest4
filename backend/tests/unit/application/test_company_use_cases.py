from decimal import Decimal
from unittest.mock import AsyncMock
from uuid import uuid4

import pytest

from app.application.schemas.company import CreateCompanyRequest, UpdateCompanyRequest
from app.application.use_cases.company_use_cases import (
    BulkDeleteCompaniesUseCase,
    CreateCompanyUseCase,
    DeleteCompanyUseCase,
    GetCompanyUseCase,
    ListCompaniesUseCase,
    UpdateCompanyUseCase,
)
from app.domain.entities.company import Company
from app.domain.exceptions import CompanyAlreadyExistsError, CompanyNotFoundError
from app.domain.repositories.company_repository import CompanyRepository


@pytest.fixture
def mock_repo() -> AsyncMock:
    return AsyncMock(spec=CompanyRepository)


def _make_company(name: str = "Acme Corp", **kwargs: object) -> Company:
    return Company(name=name, **kwargs)


class TestListCompaniesUseCase:
    async def test_returns_paginated_response(self, mock_repo: AsyncMock) -> None:
        # Arrange
        companies = [_make_company("A"), _make_company("B")]
        mock_repo.get_all.return_value = (companies, 2)
        use_case = ListCompaniesUseCase(mock_repo)

        # Act
        result = await use_case.execute(page=1, page_size=10)

        # Assert
        assert len(result.items) == 2
        assert result.total == 2
        assert result.page == 1
        assert result.page_size == 10
        assert result.total_pages == 1
        mock_repo.get_all.assert_called_once_with(page=1, page_size=10)

    async def test_returns_empty_when_no_companies(self, mock_repo: AsyncMock) -> None:
        # Arrange
        mock_repo.get_all.return_value = ([], 0)
        use_case = ListCompaniesUseCase(mock_repo)

        # Act
        result = await use_case.execute()

        # Assert
        assert result.items == []
        assert result.total == 0
        assert result.total_pages == 0

    async def test_calculates_total_pages_correctly(self, mock_repo: AsyncMock) -> None:
        # Arrange
        mock_repo.get_all.return_value = ([], 25)
        use_case = ListCompaniesUseCase(mock_repo)

        # Act
        result = await use_case.execute(page=1, page_size=10)

        # Assert
        assert result.total_pages == 3


class TestGetCompanyUseCase:
    async def test_returns_company_when_found(self, mock_repo: AsyncMock) -> None:
        # Arrange
        company = _make_company()
        mock_repo.get_by_id.return_value = company
        use_case = GetCompanyUseCase(mock_repo)

        # Act
        result = await use_case.execute(company.id)

        # Assert
        assert result.name == "Acme Corp"
        assert result.id == company.id

    async def test_raises_not_found_when_missing(self, mock_repo: AsyncMock) -> None:
        # Arrange
        mock_repo.get_by_id.return_value = None
        use_case = GetCompanyUseCase(mock_repo)
        company_id = uuid4()

        # Act / Assert
        with pytest.raises(CompanyNotFoundError):
            await use_case.execute(company_id)


class TestCreateCompanyUseCase:
    async def test_creates_company_successfully(self, mock_repo: AsyncMock) -> None:
        # Arrange
        mock_repo.get_by_name.return_value = None
        mock_repo.save.side_effect = lambda c: c
        use_case = CreateCompanyUseCase(mock_repo)
        request = CreateCompanyRequest(name="Acme Corp", revenue=Decimal("1000"), expenses=Decimal("500"))

        # Act
        result = await use_case.execute(request)

        # Assert
        assert result.name == "Acme Corp"
        assert result.profit == Decimal("500")
        mock_repo.save.assert_called_once()

    async def test_raises_already_exists_when_duplicate_name(self, mock_repo: AsyncMock) -> None:
        # Arrange
        mock_repo.get_by_name.return_value = _make_company()
        use_case = CreateCompanyUseCase(mock_repo)
        request = CreateCompanyRequest(name="Acme Corp")

        # Act / Assert
        with pytest.raises(CompanyAlreadyExistsError):
            await use_case.execute(request)


class TestUpdateCompanyUseCase:
    async def test_updates_company_successfully(self, mock_repo: AsyncMock) -> None:
        # Arrange
        company = _make_company()
        mock_repo.get_by_id.return_value = company
        mock_repo.update.side_effect = lambda c: c
        use_case = UpdateCompanyUseCase(mock_repo)
        request = UpdateCompanyRequest(name="Acme Corp", city="New York")

        # Act
        result = await use_case.execute(company.id, request)

        # Assert
        assert result.city == "New York"
        mock_repo.update.assert_called_once()

    async def test_raises_not_found_when_missing(self, mock_repo: AsyncMock) -> None:
        # Arrange
        mock_repo.get_by_id.return_value = None
        use_case = UpdateCompanyUseCase(mock_repo)
        request = UpdateCompanyRequest(name="Acme Corp")

        # Act / Assert
        with pytest.raises(CompanyNotFoundError):
            await use_case.execute(uuid4(), request)

    async def test_raises_already_exists_when_name_conflicts(self, mock_repo: AsyncMock) -> None:
        # Arrange
        company = _make_company("Original")
        other = _make_company("Taken")
        mock_repo.get_by_id.return_value = company
        mock_repo.get_by_name.return_value = other
        use_case = UpdateCompanyUseCase(mock_repo)
        request = UpdateCompanyRequest(name="Taken")

        # Act / Assert
        with pytest.raises(CompanyAlreadyExistsError):
            await use_case.execute(company.id, request)


class TestDeleteCompanyUseCase:
    async def test_deletes_existing_company(self, mock_repo: AsyncMock) -> None:
        # Arrange
        company = _make_company()
        mock_repo.get_by_id.return_value = company
        use_case = DeleteCompanyUseCase(mock_repo)

        # Act
        await use_case.execute(company.id)

        # Assert
        mock_repo.delete.assert_called_once_with(company.id)

    async def test_raises_not_found_when_missing(self, mock_repo: AsyncMock) -> None:
        # Arrange
        mock_repo.get_by_id.return_value = None
        use_case = DeleteCompanyUseCase(mock_repo)

        # Act / Assert
        with pytest.raises(CompanyNotFoundError):
            await use_case.execute(uuid4())


class TestBulkDeleteCompaniesUseCase:
    async def test_bulk_deletes_companies(self, mock_repo: AsyncMock) -> None:
        # Arrange
        ids = [uuid4(), uuid4(), uuid4()]
        use_case = BulkDeleteCompaniesUseCase(mock_repo)

        # Act
        await use_case.execute(ids)

        # Assert
        mock_repo.bulk_delete.assert_called_once_with(ids)

    async def test_bulk_delete_with_empty_list(self, mock_repo: AsyncMock) -> None:
        # Arrange
        use_case = BulkDeleteCompaniesUseCase(mock_repo)

        # Act
        await use_case.execute([])

        # Assert
        mock_repo.bulk_delete.assert_called_once_with([])
