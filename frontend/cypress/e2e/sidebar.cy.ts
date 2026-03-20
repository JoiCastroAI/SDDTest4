describe("Sidebar Navigation", () => {
  beforeEach(() => {
    cy.visit("/dashboard");
  });

  it("renders sidebar on dashboard page", () => {
    cy.get('[data-testid="sidebar"]').should("be.visible");
  });

  it("renders sidebar on companies page", () => {
    cy.visit("/companies");
    cy.get('[data-testid="sidebar"]').should("be.visible");
  });

  it("shows navigation items", () => {
    cy.get('[data-testid="nav-dashboard"]').should("be.visible");
    cy.get('[data-testid="nav-companies"]').should("be.visible");
  });

  it("highlights active route - dashboard", () => {
    cy.get('[data-testid="nav-dashboard"]').should("have.class", "active");
    cy.get('[data-testid="nav-companies"]').should("not.have.class", "active");
  });

  it("highlights active route - companies", () => {
    cy.get('[data-testid="nav-companies"]').click();
    cy.url().should("include", "/companies");
    cy.get('[data-testid="nav-companies"]').should("have.class", "active");
    cy.get('[data-testid="nav-dashboard"]').should("not.have.class", "active");
  });

  it("navigates between pages via sidebar", () => {
    cy.get('[data-testid="nav-companies"]').click();
    cy.url().should("include", "/companies");

    cy.get('[data-testid="nav-dashboard"]').click();
    cy.url().should("include", "/dashboard");
  });

  it("toggles collapse and expand", () => {
    cy.get('[data-testid="sidebar-toggle"]').click();
    cy.get('[data-testid="sidebar"]').invoke("css", "width").then((width) => {
      expect(parseInt(String(width))).to.be.lessThan(100);
    });

    cy.get('[data-testid="sidebar-toggle"]').click();
    cy.get('[data-testid="sidebar"]').invoke("css", "width").then((width) => {
      expect(parseInt(String(width))).to.be.greaterThan(200);
    });
  });
});
