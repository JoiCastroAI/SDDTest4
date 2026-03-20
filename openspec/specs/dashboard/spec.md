# Dashboard Specification

## Purpose

Provides a financial analytics dashboard that displays KPI summaries and visualizations derived from company data. The dashboard is a frontend-only capability — it fetches all companies from the API and computes aggregations client-side.

## Requirements

### Requirement: Display KPI summary cards

The system SHALL display summary KPI cards showing aggregated financial and operational metrics across all companies.

#### Scenario: KPIs with data
- **GIVEN** companies with financial data exist
- **WHEN** the user navigates to `/dashboard`
- **THEN** the dashboard displays KPI cards for: total Revenue, total Expenses, total Profit, total Employees, and total Clients
<!-- inferred -->

#### Scenario: KPIs with no data
- **GIVEN** no companies exist
- **WHEN** the user navigates to `/dashboard`
- **THEN** the KPI cards display zero values
<!-- estimated -->

### Requirement: Display revenue chart

The system SHALL display a bar chart showing revenue for the top companies.

#### Scenario: Revenue chart renders
- **GIVEN** companies with revenue data exist
- **WHEN** the user views the dashboard
- **THEN** a bar chart showing top companies by revenue is displayed
<!-- inferred -->

### Requirement: Display profit evolution chart

The system SHALL display a line chart visualizing profit trends.

#### Scenario: Profit chart renders
- **GIVEN** companies with financial data exist
- **WHEN** the user views the dashboard
- **THEN** a profit evolution line chart is rendered
<!-- inferred -->

### Requirement: Display expenses vs revenue chart

The system SHALL display a combined chart comparing expenses and revenue.

#### Scenario: Comparison chart renders
- **GIVEN** companies with financial data exist
- **WHEN** the user views the dashboard
- **THEN** an expenses vs revenue comparison chart is rendered
<!-- inferred -->

### Requirement: Display company ranking table

The system SHALL display a ranking table of companies sorted by a financial metric.

#### Scenario: Ranking table with data
- **GIVEN** companies exist
- **WHEN** the user views the dashboard
- **THEN** a ranking table with company names and financial metrics is displayed
<!-- inferred -->

### Requirement: Dashboard data derives from companies API

The dashboard MUST NOT have its own backend endpoints. All data is fetched from the companies listing endpoint and aggregated in the frontend.

#### Scenario: Data source
- **GIVEN** the dashboard page loads
- **WHEN** data is fetched
- **THEN** the `GET /companies` endpoint is called and all KPIs/charts are computed from the response
<!-- inferred -->
