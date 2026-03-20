class DomainException(Exception):
    pass


class EntityNotFoundError(DomainException):
    def __init__(self, entity: str, entity_id: str) -> None:
        super().__init__(f"{entity} not found: {entity_id}")
        self.entity = entity
        self.entity_id = entity_id


class EntityAlreadyExistsError(DomainException):
    def __init__(self, entity: str, field: str, value: str) -> None:
        super().__init__(f"{entity} with {field} '{value}' already exists")
        self.entity = entity
        self.field = field
        self.value = value


class CompanyNotFoundError(EntityNotFoundError):
    def __init__(self, company_id: str) -> None:
        super().__init__("Company", company_id)


class CompanyAlreadyExistsError(EntityAlreadyExistsError):
    def __init__(self, name: str) -> None:
        super().__init__("Company", "name", name)
