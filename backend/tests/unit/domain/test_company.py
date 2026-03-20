from decimal import Decimal
from uuid import UUID

from app.domain.entities.company import Company


def test_company_creation_with_all_fields() -> None:
    # Arrange / Act
    company = Company(
        name="Acme Corp",
        city="Seattle",
        state="WA",
        revenue=Decimal("4100000"),
        expenses=Decimal("2800000"),
        employees=89,
        clients=340,
    )

    # Assert
    assert isinstance(company.id, UUID)
    assert company.name == "Acme Corp"
    assert company.city == "Seattle"
    assert company.state == "WA"
    assert company.revenue == Decimal("4100000")
    assert company.expenses == Decimal("2800000")
    assert company.profit == Decimal("1300000")
    assert company.employees == 89
    assert company.clients == 340
    assert company.created_at is not None
    assert company.updated_at is not None


def test_company_creation_with_required_fields_only() -> None:
    # Arrange / Act
    company = Company(name="Acme Corp")

    # Assert
    assert isinstance(company.id, UUID)
    assert company.name == "Acme Corp"
    assert company.street is None
    assert company.city is None
    assert company.state is None
    assert company.zip_code is None
    assert company.country is None
    assert company.revenue == Decimal("0")
    assert company.expenses == Decimal("0")
    assert company.employees == 0
    assert company.clients == 0
    assert company.profit == Decimal("0")


def test_profit_is_computed_from_revenue_minus_expenses() -> None:
    # Arrange
    company = Company(
        name="Test Corp",
        revenue=Decimal("5000.50"),
        expenses=Decimal("3000.25"),
    )

    # Act
    profit = company.profit

    # Assert
    assert profit == Decimal("2000.25")


def test_profit_can_be_negative() -> None:
    # Arrange
    company = Company(
        name="Loss Corp",
        revenue=Decimal("1000"),
        expenses=Decimal("5000"),
    )

    # Assert
    assert company.profit == Decimal("-4000")


def test_each_company_gets_unique_id() -> None:
    # Arrange / Act
    company1 = Company(name="Company A")
    company2 = Company(name="Company B")

    # Assert
    assert company1.id != company2.id
