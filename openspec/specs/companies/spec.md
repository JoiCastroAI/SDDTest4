# Companies Specification

## Purpose

Provides full CRUD management of company entities including financial data (revenue, expenses), employee/client counts, and address information. Supports pagination, individual operations, and bulk delete.

## Requirements

### Requirement: List companies with pagination

The system SHALL return a paginated list of companies ordered by name.

#### Scenario: Default pagination
- **GIVEN** companies exist in the database
- **WHEN** a GET request is made to `/companies` without query parameters
- **THEN** the response contains up to 10 companies on page 1 with total count and total pages

#### Scenario: Custom page and page size
- **GIVEN** 25 companies exist
- **WHEN** a GET request is made to `/companies?page=2&page_size=10`
- **THEN** the response contains companies 11-20, with `total=25`, `page=2`, `total_pages=3`

#### Scenario: Empty list
- **GIVEN** no companies exist
- **WHEN** a GET request is made to `/companies`
- **THEN** the response contains `items=[]`, `total=0`, `total_pages=0`

### Requirement: Get company by ID

The system SHALL return a single company when queried by its UUID.

#### Scenario: Company exists
- **GIVEN** a company with ID `{id}` exists
- **WHEN** a GET request is made to `/companies/{id}`
- **THEN** the response contains the full company details including computed `profit`

#### Scenario: Company not found
- **GIVEN** no company with ID `{id}` exists
- **WHEN** a GET request is made to `/companies/{id}`
- **THEN** the system returns 404 with `{"detail": "Company not found: {id}"}`

### Requirement: Create a new company

The system SHALL create a company with a unique name and return it with a generated UUID.

#### Scenario: Successful creation
- **GIVEN** no company named "Acme Corp" exists
- **WHEN** a POST request is made to `/companies` with `{"name": "Acme Corp", "revenue": 100000}`
- **THEN** the system returns 201 with the created company including a generated `id` and timestamps

#### Scenario: Duplicate name
- **GIVEN** a company named "Acme Corp" already exists
- **WHEN** a POST request is made to `/companies` with `{"name": "Acme Corp"}`
- **THEN** the system returns 409 with `{"detail": "Company with name 'Acme Corp' already exists"}`

#### Scenario: Missing required name
- **GIVEN** any state
- **WHEN** a POST request is made to `/companies` with `{}` (no name)
- **THEN** the system returns 422 with a validation error

### Requirement: Update an existing company

The system SHALL update all fields of an existing company.

#### Scenario: Successful update
- **GIVEN** a company with ID `{id}` exists
- **WHEN** a PUT request is made to `/companies/{id}` with updated fields
- **THEN** the system returns 200 with the updated company and a new `updated_at` timestamp

#### Scenario: Update to duplicate name
- **GIVEN** companies "Alpha" and "Beta" exist
- **WHEN** a PUT request is made to update "Alpha" with `name: "Beta"`
- **THEN** the system returns 409

#### Scenario: Update non-existent company
- **GIVEN** no company with ID `{id}` exists
- **WHEN** a PUT request is made to `/companies/{id}`
- **THEN** the system returns 404

### Requirement: Delete a company

The system SHALL delete a company by ID.

#### Scenario: Successful deletion
- **GIVEN** a company with ID `{id}` exists
- **WHEN** a DELETE request is made to `/companies/{id}`
- **THEN** the system returns 204 and the company no longer exists

#### Scenario: Delete non-existent company
- **GIVEN** no company with ID `{id}` exists
- **WHEN** a DELETE request is made to `/companies/{id}`
- **THEN** the system returns 404

### Requirement: Bulk delete companies

The system SHALL delete multiple companies in a single request.

#### Scenario: Bulk delete existing companies
- **GIVEN** companies with IDs `[id1, id2, id3]` exist
- **WHEN** a DELETE request is made to `/companies` with `{"ids": ["id1", "id2", "id3"]}`
- **THEN** the system returns 204 and all specified companies are deleted

#### Scenario: Bulk delete with non-existent IDs
- **GIVEN** only `id1` exists, `id2` does not
- **WHEN** a DELETE request is made with `{"ids": ["id1", "id2"]}`
- **THEN** the system returns 204, deleting `id1` and silently skipping `id2`
<!-- inferred -->

### Requirement: Computed profit field

The system SHALL return a `profit` field computed as `revenue - expenses` in all company responses.

#### Scenario: Profit calculation
- **GIVEN** a company with `revenue=100000` and `expenses=60000`
- **WHEN** the company is retrieved
- **THEN** the response includes `profit=40000`
