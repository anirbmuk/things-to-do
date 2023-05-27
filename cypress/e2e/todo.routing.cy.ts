import * as data from '../fixtures/data.json';

describe('Test routing', () => {
  it('should redirect invalid page to /notfound', () => {
    cy.visit('/wrong');
    cy.url().should('contain', '/notfound');
    cy.title().should('equal', `404 | ${data.title}`);
  });

  it('should not display action buttons', () => {
    cy.visit('/wrong');
    cy.get('[data-test-id=showsearch]').should('not.exist');
    cy.get('[data-test-id=addtodobtn]').should('not.exist');
  });

  it('clicking on title link should correctly redirect to main page', () => {
    cy.visit('/wrong');
    cy.get('[data-test-id=titlelink]').click();
    cy.url().should('contain', data.baseUrl);
    cy.title().should('equal', data.title);
  });
});
