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

  describe('Test action panel', () => {
    beforeEach(() => cy.clearAllLocalStorage());

    it('should have Day selected in Group By toggle button', () => {
      cy.visit('/');

      cy.get('[data-test-id=groupbydate]').should('contain.text', 'Day');
      cy.get('[data-test-id=groupbymonth]').should('contain.text', 'Month');

      cy.get('[data-test-id=groupbydate]').should(
        'have.class',
        'mat-button-toggle-checked'
      );
      cy.get('[data-test-id=groupbymonth]').should(
        'not.have.class',
        'mat-button-toggle-checked'
      );
    });

    it('should have Hide selected in Completed toggle button', () => {
      cy.visit('/');

      cy.get('[data-test-id=showallhide]').should('contain.text', 'Hide');
      cy.get('[data-test-id=showallshow]').should('contain.text', 'Show');

      cy.get('[data-test-id=showallhide]').should(
        'have.class',
        'mat-button-toggle-checked'
      );
      cy.get('[data-test-id=showallshow]').should(
        'not.have.class',
        'mat-button-toggle-checked'
      );
    });

    it('should toggle Group By', () => {
      cy.visit('/');

      cy.log('Toggle GroupBy to Month');
      cy.get('[data-test-id=groupbymonth]').click();
      cy.get('[data-test-id=groupbydate]').should(
        'not.have.class',
        'mat-button-toggle-checked'
      );
      cy.get('[data-test-id=groupbymonth]').should(
        'have.class',
        'mat-button-toggle-checked'
      );
      cy.getAllLocalStorage({ log: true }).then((result) => {
        const domainKeys = result['http://localhost:4200'];
        expect(domainKeys['groupby']).to.equal('"month"');
      });

      cy.log('Toggle GroupBy to Day');
      cy.get('[data-test-id=groupbydate]').click();
      cy.get('[data-test-id=groupbydate]').should(
        'have.class',
        'mat-button-toggle-checked'
      );
      cy.get('[data-test-id=groupbymonth]').should(
        'not.have.class',
        'mat-button-toggle-checked'
      );
      cy.getAllLocalStorage({ log: true }).then((result) => {
        const domainKeys = result['http://localhost:4200'];
        expect(domainKeys['groupby']).to.equal('"day"');
      });
    });

    it('should toggle Completed', () => {
      cy.visit('/');

      cy.log('Toggle Completed to Show');
      cy.get('[data-test-id=showallshow]').click();
      cy.get('[data-test-id=showallhide]').should(
        'not.have.class',
        'mat-button-toggle-checked'
      );
      cy.get('[data-test-id=showallshow]').should(
        'have.class',
        'mat-button-toggle-checked'
      );
      cy.getAllLocalStorage({ log: true }).then((result) => {
        const domainKeys = result['http://localhost:4200'];
        expect(domainKeys['showall']).to.equal('true');
      });

      cy.log('Toggle Completed to Hide');
      cy.get('[data-test-id=showallhide]').click();
      cy.get('[data-test-id=showallhide]').should(
        'have.class',
        'mat-button-toggle-checked'
      );
      cy.get('[data-test-id=showallshow]').should(
        'not.have.class',
        'mat-button-toggle-checked'
      );
      cy.getAllLocalStorage({ log: true }).then((result) => {
        const domainKeys = result['http://localhost:4200'];
        expect(domainKeys['showall']).to.equal('false');
      });
    });
  });

  describe('Test empty home page', () => {
    it('should show empty message', () => {
      cy.visit('/');

      cy.get('[data-test-id=nodata]').should('contain.text', 'No TODO found');
    });
  });
});
