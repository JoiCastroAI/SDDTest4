"""Seed script that creates 22 diverse companies with realistic financial data.

Usage:
    python -m scripts.seed_companies

Idempotent: skips companies whose name already exists.
"""

import asyncio
from decimal import Decimal

from sqlalchemy import select

from app.infrastructure.database.models.company import CompanyModel
from app.infrastructure.database.session import async_session

SEED_COMPANIES: list[dict] = [
    {
        "name": "FinanceHub Corp",
        "street": "123 Wall St",
        "city": "New York",
        "state": "NY",
        "zip_code": "10005",
        "country": "US",
        "revenue": Decimal("9800000.00"),
        "expenses": Decimal("6500000.00"),
        "employees": 203,
        "clients": 780,
    },
    {
        "name": "HealthPlus Pharma",
        "street": "456 Medical Ave",
        "city": "Boston",
        "state": "MA",
        "zip_code": "02101",
        "country": "US",
        "revenue": Decimal("7200000.00"),
        "expenses": Decimal("5100000.00"),
        "employees": 156,
        "clients": 450,
    },
    {
        "name": "NexGen Robotics",
        "street": "789 Innovation Blvd",
        "city": "San Francisco",
        "state": "CA",
        "zip_code": "94105",
        "country": "US",
        "revenue": Decimal("5500000.00"),
        "expenses": Decimal("3900000.00"),
        "employees": 112,
        "clients": 180,
    },
    {
        "name": "CloudNine Services",
        "street": "321 Cloud Rd",
        "city": "Seattle",
        "state": "WA",
        "zip_code": "98101",
        "country": "US",
        "revenue": Decimal("4100000.00"),
        "expenses": Decimal("2800000.00"),
        "employees": 89,
        "clients": 340,
    },
    {
        "name": "DataFlow Analytics",
        "street": "654 Data Dr",
        "city": "Austin",
        "state": "TX",
        "zip_code": "73301",
        "country": "US",
        "revenue": Decimal("3200000.00"),
        "expenses": Decimal("2100000.00"),
        "employees": 67,
        "clients": 210,
    },
    {
        "name": "TechVision Solutions",
        "street": "987 Tech Park",
        "city": "Denver",
        "state": "CO",
        "zip_code": "80201",
        "country": "US",
        "revenue": Decimal("2500000.00"),
        "expenses": Decimal("1800000.00"),
        "employees": 45,
        "clients": 120,
    },
    {
        "name": "GreenEarth Industries",
        "street": "147 Eco Lane",
        "city": "Portland",
        "state": "OR",
        "zip_code": "97201",
        "country": "US",
        "revenue": Decimal("1800000.00"),
        "expenses": Decimal("1200000.00"),
        "employees": 32,
        "clients": 85,
    },
    {
        "name": "EduTech Learning",
        "street": "258 Campus Way",
        "city": "Chicago",
        "state": "IL",
        "zip_code": "60601",
        "country": "US",
        "revenue": Decimal("1600000.00"),
        "expenses": Decimal("1100000.00"),
        "employees": 28,
        "clients": 95,
    },
    {
        "name": "Alpine Manufacturing AG",
        "street": "12 Industriestrasse",
        "city": "Zurich",
        "state": None,
        "zip_code": "8001",
        "country": "CH",
        "revenue": Decimal("14500000.00"),
        "expenses": Decimal("10150000.00"),
        "employees": 487,
        "clients": 1200,
    },
    {
        "name": "SolarWave Energy",
        "street": "88 Renewable Blvd",
        "city": "Phoenix",
        "state": "AZ",
        "zip_code": "85001",
        "country": "US",
        "revenue": Decimal("6300000.00"),
        "expenses": Decimal("4400000.00"),
        "employees": 134,
        "clients": 520,
    },
    {
        "name": "MediCare Solutions GmbH",
        "street": "45 Gesundheitsweg",
        "city": "Munich",
        "state": "Bavaria",
        "zip_code": "80331",
        "country": "DE",
        "revenue": Decimal("8900000.00"),
        "expenses": Decimal("6230000.00"),
        "employees": 245,
        "clients": 890,
    },
    {
        "name": "Pacific Logistics Ltd",
        "street": "7 Harbour View",
        "city": "Singapore",
        "state": None,
        "zip_code": "018956",
        "country": "SG",
        "revenue": Decimal("11200000.00"),
        "expenses": Decimal("8960000.00"),
        "employees": 312,
        "clients": 1650,
    },
    {
        "name": "CyberShield Security",
        "street": "900 Defense Pkwy",
        "city": "Arlington",
        "state": "VA",
        "zip_code": "22201",
        "country": "US",
        "revenue": Decimal("4800000.00"),
        "expenses": Decimal("3360000.00"),
        "employees": 98,
        "clients": 275,
    },
    {
        "name": "FreshHarvest Foods",
        "street": "33 Agri Road",
        "city": "Sacramento",
        "state": "CA",
        "zip_code": "95814",
        "country": "US",
        "revenue": Decimal("2200000.00"),
        "expenses": Decimal("1650000.00"),
        "employees": 52,
        "clients": 310,
    },
    {
        "name": "Quantum Computing Labs",
        "street": "1 Research Circle",
        "city": "Cambridge",
        "state": "MA",
        "zip_code": "02139",
        "country": "US",
        "revenue": Decimal("3700000.00"),
        "expenses": Decimal("3145000.00"),
        "employees": 76,
        "clients": 55,
    },
    {
        "name": "Nordic Shipping AS",
        "street": "15 Havnegata",
        "city": "Oslo",
        "state": None,
        "zip_code": "0150",
        "country": "NO",
        "revenue": Decimal("7800000.00"),
        "expenses": Decimal("5850000.00"),
        "employees": 189,
        "clients": 420,
    },
    {
        "name": "UrbanBuild Construction",
        "street": "222 Builder Ave",
        "city": "Dallas",
        "state": "TX",
        "zip_code": "75201",
        "country": "US",
        "revenue": Decimal("12800000.00"),
        "expenses": Decimal("10240000.00"),
        "employees": 410,
        "clients": 195,
    },
    {
        "name": "BrightMinds Academy",
        "street": "5 Scholar Lane",
        "city": "Toronto",
        "state": "ON",
        "zip_code": "M5H 2N2",
        "country": "CA",
        "revenue": Decimal("950000.00"),
        "expenses": Decimal("712500.00"),
        "employees": 18,
        "clients": 640,
    },
    {
        "name": "AeroTech Dynamics",
        "street": "800 Aerospace Dr",
        "city": "Toulouse",
        "state": None,
        "zip_code": "31000",
        "country": "FR",
        "revenue": Decimal("15000000.00"),
        "expenses": Decimal("11250000.00"),
        "employees": 520,
        "clients": 78,
    },
    {
        "name": "RetailNext Commerce",
        "street": "60 Market St",
        "city": "London",
        "state": None,
        "zip_code": "EC2R 8AH",
        "country": "GB",
        "revenue": Decimal("5100000.00"),
        "expenses": Decimal("3825000.00"),
        "employees": 143,
        "clients": 1850,
    },
    {
        "name": "BioVerde Agritech",
        "street": "Av. Paulista 1000",
        "city": "Sao Paulo",
        "state": "SP",
        "zip_code": "01310-100",
        "country": "BR",
        "revenue": Decimal("3400000.00"),
        "expenses": Decimal("2380000.00"),
        "employees": 94,
        "clients": 360,
    },
    {
        "name": "Summit Financial Advisors",
        "street": "400 Bay St",
        "city": "Melbourne",
        "state": "VIC",
        "zip_code": "3000",
        "country": "AU",
        "revenue": Decimal("6700000.00"),
        "expenses": Decimal("4020000.00"),
        "employees": 167,
        "clients": 920,
    },
]


async def seed() -> None:
    created = 0
    skipped = 0

    async with async_session() as session:
        existing_names_result = await session.execute(
            select(CompanyModel.name)
        )
        existing_names: set[str] = {row[0] for row in existing_names_result.all()}

        for company_data in SEED_COMPANIES:
            if company_data["name"] in existing_names:
                skipped += 1
                continue

            company = CompanyModel(**company_data)
            session.add(company)
            created += 1

        await session.commit()

    total = await verify_count()
    print(f"Seed complete: {created} created, {skipped} skipped, {total} total companies in database.")

    if total < 22:
        print(f"WARNING: Expected at least 22 companies, found {total}.")


async def verify_count() -> int:
    async with async_session() as session:
        result = await session.execute(
            select(CompanyModel.id)
        )
        return len(result.all())


if __name__ == "__main__":
    asyncio.run(seed())
