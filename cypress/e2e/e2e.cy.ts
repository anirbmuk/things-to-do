import * as data from '../fixtures/data.json';

describe('E2E for Things-TODO', () => {

  describe('Test routing', () => {
    it('should redirect to notfound', () => {
      cy.visit('/wrong');
      cy.url().should('contain', '/notfound');
    });

    it('clicking on title link should correctly redirect to main page', () => {
      cy.visit('/wrong');
      cy.get('[data-test-id=titlelink]').should('contain.text', 'Things TODO');
      cy.get('[data-test-id=titlelink]').click();
      cy.url().should('equal', data.baseUrl);
    });
  });

});
