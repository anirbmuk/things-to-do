describe('Test empty home page', () => {
  it('should show empty message', () => {
    cy.visit('/');

    cy.get('[data-test-id=nodata]').should('contain.text', 'No TODOs found');
  });
});
