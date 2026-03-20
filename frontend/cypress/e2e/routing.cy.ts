describe("Routing", () => {
  it("redirects / to /dashboard", () => {
    cy.visit("/");
    cy.url().should("include", "/dashboard");
  });

  it("loads companies page inside layout with sidebar", () => {
    cy.visit("/companies");
    cy.get('[data-testid="sidebar"]').should("be.visible");
  });

  it("loads dashboard page inside layout with sidebar", () => {
    cy.visit("/dashboard");
    cy.get('[data-testid="sidebar"]').should("be.visible");
    cy.get('[data-testid="dashboard-page"]').should("be.visible");
  });

  it("sidebar persists across navigation", () => {
    cy.visit("/dashboard");
    cy.get('[data-testid="sidebar-toggle"]').click();

    cy.get('[data-testid="nav-companies"]').click();
    cy.url().should("include", "/companies");
    cy.get('[data-testid="sidebar"]').invoke("css", "width").then((width) => {
      expect(parseInt(String(width))).to.be.lessThan(100);
    });
  });
});
