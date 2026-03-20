describe("Companies", () => {
  beforeEach(() => {
    cy.visit("/companies");
  });

  describe("List View", () => {
    it("should render the companies page", () => {
      cy.contains("Companies").should("be.visible");
      cy.get("[data-testid='create-company-btn']").should("be.visible");
    });

    it("should display empty state when no companies exist", () => {
      cy.get("[data-testid='empty-state']").should("be.visible");
      cy.contains("No companies yet").should("be.visible");
    });

    it("should display loading spinner initially", () => {
      cy.get("[data-testid='loading-spinner']").should("exist");
    });
  });

  describe("Create Company", () => {
    it("should open create modal when clicking New Company", () => {
      cy.get("[data-testid='create-company-btn']").click();
      cy.get("[data-testid='company-form-modal']").should("be.visible");
      cy.contains("New Company").should("be.visible");
    });

    it("should show validation error when name is empty", () => {
      cy.get("[data-testid='create-company-btn']").click();
      cy.get("[data-testid='form-submit-btn']").click();
      cy.contains("Company name is required").should("be.visible");
    });

    it("should create a company via modal", () => {
      cy.get("[data-testid='create-company-btn']").click();
      cy.get("[data-testid='company-name-input']").type("Test Company");
      cy.get("[data-testid='company-city-input']").type("Seattle");
      cy.get("[data-testid='company-state-input']").type("WA");
      cy.get("[data-testid='company-revenue-input']").clear().type("100000");
      cy.get("[data-testid='company-expenses-input']").clear().type("50000");
      cy.get("[data-testid='form-submit-btn']").click();
      cy.get("[data-testid='company-form-modal']").should("not.exist");
      cy.get("[data-testid='companies-table']").should("be.visible");
      cy.contains("Test Company").should("be.visible");
    });
  });

  describe("Edit Company", () => {
    beforeEach(() => {
      // Create a company first
      cy.get("[data-testid='create-company-btn']").click();
      cy.get("[data-testid='company-name-input']").type("Edit Target");
      cy.get("[data-testid='form-submit-btn']").click();
      cy.get("[data-testid='companies-table']").should("be.visible");
    });

    it("should open edit modal with pre-populated data", () => {
      cy.contains("Edit Target")
        .parent("tr")
        .find("[data-testid^='edit-btn-']")
        .click();
      cy.get("[data-testid='company-form-modal']").should("be.visible");
      cy.contains("Edit Company").should("be.visible");
      cy.get("[data-testid='company-name-input']").should(
        "have.value",
        "Edit Target"
      );
    });

    it("should update a company via modal", () => {
      cy.contains("Edit Target")
        .parent("tr")
        .find("[data-testid^='edit-btn-']")
        .click();
      cy.get("[data-testid='company-city-input']").clear().type("Portland");
      cy.get("[data-testid='form-submit-btn']").click();
      cy.get("[data-testid='company-form-modal']").should("not.exist");
    });
  });

  describe("Delete Company", () => {
    beforeEach(() => {
      cy.get("[data-testid='create-company-btn']").click();
      cy.get("[data-testid='company-name-input']").type("Delete Target");
      cy.get("[data-testid='form-submit-btn']").click();
      cy.get("[data-testid='companies-table']").should("be.visible");
    });

    it("should delete a single company", () => {
      cy.contains("Delete Target")
        .parent("tr")
        .find("[data-testid^='delete-btn-']")
        .click();
      cy.get("[data-testid='confirm-delete-modal']").should("be.visible");
      cy.get("[data-testid='confirm-delete-btn']").click();
      cy.contains("Delete Target").should("not.exist");
    });
  });

  describe("Bulk Selection and Delete", () => {
    beforeEach(() => {
      // Create multiple companies
      for (const name of ["Bulk A", "Bulk B", "Bulk C"]) {
        cy.get("[data-testid='create-company-btn']").click();
        cy.get("[data-testid='company-name-input']").type(name);
        cy.get("[data-testid='form-submit-btn']").click();
        cy.get("[data-testid='companies-table']").should("be.visible");
      }
    });

    it("should select all rows via header checkbox", () => {
      cy.get("[data-testid='select-all-checkbox']").click();
      cy.get("[data-testid='bulk-actions-bar']").should("be.visible");
      cy.contains("3 companies selected").should("be.visible");
    });

    it("should bulk delete selected companies", () => {
      cy.get("[data-testid='select-all-checkbox']").click();
      cy.get("[data-testid='bulk-delete-btn']").click();
      cy.get("[data-testid='confirm-delete-modal']").should("be.visible");
      cy.get("[data-testid='confirm-delete-btn']").click();
      cy.get("[data-testid='empty-state']").should("be.visible");
    });
  });

  describe("Pagination", () => {
    beforeEach(() => {
      // Create enough companies for pagination
      for (let i = 0; i < 6; i++) {
        cy.get("[data-testid='create-company-btn']").click();
        cy.get("[data-testid='company-name-input']").type(`Page Company ${i}`);
        cy.get("[data-testid='form-submit-btn']").click();
        cy.get("[data-testid='companies-table']").should("be.visible");
      }
    });

    it("should navigate between pages", () => {
      // Change page size to 5
      cy.get("[data-testid='page-size-select']").select("5");
      cy.get("[data-testid='pagination']").should("be.visible");
      cy.get("[data-testid='pagination-next']").click();
      cy.get("[data-testid='companies-table']").should("be.visible");
    });

    it("should change page size", () => {
      cy.get("[data-testid='page-size-select']").select("5");
      cy.get("[data-testid='companies-table'] tbody tr").should(
        "have.length",
        5
      );
    });
  });

  describe("Error State", () => {
    it("should display error alert on fetch failure", () => {
      cy.intercept("GET", "**/companies*", { statusCode: 500 }).as(
        "getCompanies"
      );
      cy.visit("/companies");
      cy.wait("@getCompanies");
      cy.get("[data-testid='error-alert']").should("be.visible");
    });
  });
});
