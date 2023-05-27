describe('Test Header', () => {
  it('should show correct app title', () => {
    cy.visit('/');

    cy.get('[data-test-id=titlelink]').should('contain.text', 'Things TODO');
  });

  it('should display action buttons', () => {
    cy.visit('/');

    cy.get('[data-test-id=showsearch]').should('exist');
    cy.get('[data-test-id=addtodobtn]').should('exist');
  });

  it('should correctly toggle input search field', () => {
    cy.visit('/');

    cy.get('[data-test-id=showsearch]').click();
    cy.get('[data-test-id=showsearch]').should('not.exist');
    cy.get('[data-test-id=inputsearch]').should('exist');
    cy.get('[data-test-id=clearsearch]').should('exist');

    cy.get('[data-test-id=clearsearch]').click();
    cy.get('[data-test-id=showsearch]').should('exist');
    cy.get('[data-test-id=inputsearch]').should('not.exist');
    cy.get('[data-test-id=clearsearch]').should('not.exist');
  });

  it('should open modal on clicking add icon', () => {
    cy.visit('/');

    cy.get('[data-test-id=addtodobtn]').click();
    cy.get('[data-test-id=createupdatemodal]').should('exist');
  });
});
