describe("HomePage", () => {
  beforeEach(() => {
    cy.fixture("courses.json").as("coursesJSON");
    cy.server();
    cy.route("/api/courses", "@coursesJSON").as("courses");

    cy.visit("/");
    cy.contains("All Courses");
    cy.wait("@courses");
  });

  it("should display a list of courses ", () => {
    cy.get("mat-card").should("have.length", 9);
  });
  it("should display a list of advanced courses ", () => {
    cy.get(".mat-tab-label").should("have.length", 2);
    cy.get(".mat-tab-label").last().click();

    cy.get(".mat-tab-body-active mat-card").should("have.length", 3);
    cy.get(".mat-tab-body-active mat-card-title")
      .first()
      .contains("Angular Security Course");
  });
});
