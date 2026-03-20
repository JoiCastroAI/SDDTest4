from uuid import uuid4

import pytest
from httpx import AsyncClient


class TestListCompanies:
    async def test_returns_empty_list(self, async_client: AsyncClient) -> None:
        response = await async_client.get("/companies")
        assert response.status_code == 200
        data = response.json()
        assert data["items"] == []
        assert data["total"] == 0
        assert data["total_pages"] == 0

    async def test_returns_paginated_companies(self, async_client: AsyncClient) -> None:
        # Create 3 companies
        for i in range(3):
            await async_client.post("/companies", json={"name": f"Company {i}"})

        response = await async_client.get("/companies?page=1&page_size=2")
        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) == 2
        assert data["total"] == 3
        assert data["total_pages"] == 2

    async def test_page_2_returns_remaining(self, async_client: AsyncClient) -> None:
        for i in range(3):
            await async_client.post("/companies", json={"name": f"PageTest {i}"})

        response = await async_client.get("/companies?page=2&page_size=2")
        assert response.status_code == 200
        data = response.json()
        assert len(data["items"]) == 1


class TestGetCompany:
    async def test_returns_company_when_found(self, async_client: AsyncClient) -> None:
        create_resp = await async_client.post("/companies", json={"name": "GetTest Corp"})
        company_id = create_resp.json()["id"]

        response = await async_client.get(f"/companies/{company_id}")
        assert response.status_code == 200
        assert response.json()["name"] == "GetTest Corp"

    async def test_returns_404_when_not_found(self, async_client: AsyncClient) -> None:
        response = await async_client.get(f"/companies/{uuid4()}")
        assert response.status_code == 404
        assert "not found" in response.json()["detail"]


class TestCreateCompany:
    async def test_creates_company_successfully(self, async_client: AsyncClient) -> None:
        response = await async_client.post(
            "/companies",
            json={
                "name": "CreateTest Corp",
                "city": "Seattle",
                "state": "WA",
                "revenue": 4100000,
                "expenses": 2800000,
                "employees": 89,
                "clients": 340,
            },
        )
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "CreateTest Corp"
        assert float(data["profit"]) == 1300000.0
        assert data["id"] is not None

    async def test_returns_409_on_duplicate_name(self, async_client: AsyncClient) -> None:
        await async_client.post("/companies", json={"name": "DuplicateTest"})
        response = await async_client.post("/companies", json={"name": "DuplicateTest"})
        assert response.status_code == 409
        assert "already exists" in response.json()["detail"]

    async def test_returns_422_without_name(self, async_client: AsyncClient) -> None:
        response = await async_client.post("/companies", json={})
        assert response.status_code == 422


class TestUpdateCompany:
    async def test_updates_company_successfully(self, async_client: AsyncClient) -> None:
        create_resp = await async_client.post("/companies", json={"name": "UpdateTest Corp"})
        company_id = create_resp.json()["id"]

        response = await async_client.put(
            f"/companies/{company_id}",
            json={"name": "UpdateTest Corp", "city": "New York"},
        )
        assert response.status_code == 200
        assert response.json()["city"] == "New York"

    async def test_returns_404_when_not_found(self, async_client: AsyncClient) -> None:
        response = await async_client.put(
            f"/companies/{uuid4()}", json={"name": "Ghost"}
        )
        assert response.status_code == 404

    async def test_returns_409_on_name_conflict(self, async_client: AsyncClient) -> None:
        await async_client.post("/companies", json={"name": "Conflict A"})
        create_resp = await async_client.post("/companies", json={"name": "Conflict B"})
        company_id = create_resp.json()["id"]

        response = await async_client.put(
            f"/companies/{company_id}", json={"name": "Conflict A"}
        )
        assert response.status_code == 409


class TestDeleteCompany:
    async def test_deletes_company_successfully(self, async_client: AsyncClient) -> None:
        create_resp = await async_client.post("/companies", json={"name": "DeleteTest Corp"})
        company_id = create_resp.json()["id"]

        response = await async_client.delete(f"/companies/{company_id}")
        assert response.status_code == 204

        get_response = await async_client.get(f"/companies/{company_id}")
        assert get_response.status_code == 404

    async def test_returns_404_when_not_found(self, async_client: AsyncClient) -> None:
        response = await async_client.delete(f"/companies/{uuid4()}")
        assert response.status_code == 404


class TestBulkDeleteCompanies:
    async def test_bulk_deletes_existing_companies(self, async_client: AsyncClient) -> None:
        ids = []
        for i in range(3):
            resp = await async_client.post("/companies", json={"name": f"Bulk {i}"})
            ids.append(resp.json()["id"])

        response = await async_client.request("DELETE", "/companies", json={"ids": ids})
        assert response.status_code == 204

    async def test_bulk_delete_with_some_missing(self, async_client: AsyncClient) -> None:
        resp = await async_client.post("/companies", json={"name": "BulkPartial"})
        existing_id = resp.json()["id"]

        response = await async_client.request(
            "DELETE", "/companies", json={"ids": [existing_id, str(uuid4())]}
        )
        assert response.status_code == 204

    async def test_bulk_delete_with_empty_list(self, async_client: AsyncClient) -> None:
        response = await async_client.request("DELETE", "/companies", json={"ids": []})
        assert response.status_code == 204
