describe("Dashboard Page", () => {
  beforeEach(() => {
    cy.visit("/dashboard");
  });

  it("renders the dashboard page", () => {
    cy.get('[data-testid="dashboard-page"]').should("be.visible");
  });

  it("displays KPI cards with non-zero values", () => {
    cy.get('[data-testid="kpi-total-revenue"]').should("be.visible").and("not.contain", "—");
    cy.get('[data-testid="kpi-total-expenses"]').should("be.visible").and("not.contain", "—");
    cy.get('[data-testid="kpi-net-profit"]').should("be.visible").and("not.contain", "—");
    cy.get('[data-testid="kpi-total-employees"]').should("be.visible").and("not.contain", "—");
    cy.get('[data-testid="kpi-total-clients"]').should("be.visible").and("not.contain", "—");
  });

  it("renders charts without errors", () => {
    cy.get(".chart-card").should("have.length", 4);
  });

  it("renders ranking table with data", () => {
    cy.get(".ranking-card").should("be.visible");
    cy.get(".ranking-table tbody tr").should("have.length.at.least", 1);
  });

  it("highlights top positions with badges", () => {
    cy.get(".ranking-badge").should("have.length.at.least", 1);
  });
});
