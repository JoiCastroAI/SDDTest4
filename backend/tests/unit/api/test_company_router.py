from decimal import Decimal
from unittest.mock import AsyncMock, patch
from uuid import uuid4

import pytest
from httpx import ASGITransport, AsyncClient

from app.application.schemas.company import CompanyResponse, PaginatedCompanyResponse
from app.domain.exceptions import CompanyAlreadyExistsError, CompanyNotFoundError
from app.main import app

BASE_URL = "http://test"


def _make_response(**kwargs: object) -> CompanyResponse:
    defaults = {
        "id": uuid4(),
        "name": "Acme Corp",
        "street": None,
        "city": None,
        "state": None,
        "zip_code": None,
        "country": None,
        "revenue": Decimal("0"),
        "expenses": Decimal("0"),
        "profit": Decimal("0"),
        "employees": 0,
        "clients": 0,
        "created_at": "2026-01-01T00:00:00",
        "updated_at": "2026-01-01T00:00:00",
    }
    defaults.update(kwargs)
    return CompanyResponse(**defaults)


@pytest.fixture
def async_client() -> AsyncClient:
    return AsyncClient(transport=ASGITransport(app=app), base_url=BASE_URL)


class TestListCompanies:
    async def test_returns_paginated_list(self, async_client: AsyncClient) -> None:
        # Arrange
        paginated = PaginatedCompanyResponse(
            items=[_make_response()], total=1, page=1, page_size=10, total_pages=1
        )
        with patch(
            "app.api.routers.company_router.ListCompaniesUseCase"
        ) as mock_cls:
            mock_cls.return_value.execute = AsyncMock(return_value=paginated)

            # Act
            response = await async_client.get("/companies")

        # Assert
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 1
        assert len(data["items"]) == 1


class TestGetCompany:
    async def test_returns_company_when_found(self, async_client: AsyncClient) -> None:
        # Arrange
        company_id = uuid4()
        resp = _make_response(id=company_id)
        with patch(
            "app.api.routers.company_router.GetCompanyUseCase"
        ) as mock_cls:
            mock_cls.return_value.execute = AsyncMock(return_value=resp)

            # Act
            response = await async_client.get(f"/companies/{company_id}")

        # Assert
        assert response.status_code == 200
        assert response.json()["name"] == "Acme Corp"

    async def test_returns_404_when_not_found(self, async_client: AsyncClient) -> None:
        # Arrange
        company_id = uuid4()
        with patch(
            "app.api.routers.company_router.GetCompanyUseCase"
        ) as mock_cls:
            mock_cls.return_value.execute = AsyncMock(
                side_effect=CompanyNotFoundError(str(company_id))
            )

            # Act
            response = await async_client.get(f"/companies/{company_id}")

        # Assert
        assert response.status_code == 404
        assert "not found" in response.json()["detail"]


class TestCreateCompany:
    async def test_creates_company_returns_201(self, async_client: AsyncClient) -> None:
        # Arrange
        resp = _make_response(name="New Corp")
        with patch(
            "app.api.routers.company_router.CreateCompanyUseCase"
        ) as mock_cls:
            mock_cls.return_value.execute = AsyncMock(return_value=resp)
            with patch("app.api.routers.company_router.get_db"):

                # Act
                response = await async_client.post(
                    "/companies", json={"name": "New Corp"}
                )

        # Assert
        assert response.status_code == 201
        assert response.json()["name"] == "New Corp"

    async def test_returns_409_on_duplicate_name(self, async_client: AsyncClient) -> None:
        # Arrange
        with patch(
            "app.api.routers.company_router.CreateCompanyUseCase"
        ) as mock_cls:
            mock_cls.return_value.execute = AsyncMock(
                side_effect=CompanyAlreadyExistsError("Acme Corp")
            )
            with patch("app.api.routers.company_router.get_db"):

                # Act
                response = await async_client.post(
                    "/companies", json={"name": "Acme Corp"}
                )

        # Assert
        assert response.status_code == 409
        assert "already exists" in response.json()["detail"]


class TestDeleteCompany:
    async def test_returns_204_on_success(self, async_client: AsyncClient) -> None:
        # Arrange
        company_id = uuid4()
        with patch(
            "app.api.routers.company_router.DeleteCompanyUseCase"
        ) as mock_cls:
            mock_cls.return_value.execute = AsyncMock(return_value=None)
            with patch("app.api.routers.company_router.get_db"):

                # Act
                response = await async_client.delete(f"/companies/{company_id}")

        # Assert
        assert response.status_code == 204
