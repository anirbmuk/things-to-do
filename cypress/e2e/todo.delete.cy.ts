import * as data from '../fixtures/data.json';

describe('Delete TODO', () => {
  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          data.todos.key,
          JSON.stringify([
            {
              todoid: 'test-past-todoid',
              heading: 'Past TODO heading',
              text: 'Past TODO text',
              status: 'Incomplete',
              duedate: '2020-01-01T22:00:00.000Z'
            }
          ])
        );
      }
    });
    cy.get('[data-test-id=showallshow]').click();
  });

  it('should delete existing TODO on YES', () => {
    cy.get('[data-test-id=deletetodo]').click();
    cy.wait(250);

    cy.get('[data-test-id=confirmmodal]').should('exist');
    cy.get('[data-test-id=confirmmodal-yes]').click();
    cy.wait(250);

    cy.getAllLocalStorage({ log: true }).then((result) => {
      const domainKeys = result['http://localhost:4200'];
      const output = JSON.parse(domainKeys[data.todos.key] as string);
      expect(output).to.be.instanceOf(Array).of.length(0);
    });
    cy.get('[todolist]').should('not.exist');
  });

  it('should not delete existing TODO on NO', () => {
    cy.get('[data-test-id=deletetodo]').click();
    cy.wait(250);

    cy.get('[data-test-id=confirmmodal]').should('exist');
    cy.get('[data-test-id=confirmmodal-no]').click();
    cy.wait(250);

    cy.getAllLocalStorage({ log: true }).then((result) => {
      const domainKeys = result['http://localhost:4200'];
      const output = JSON.parse(domainKeys[data.todos.key] as string);
      expect(output).to.be.instanceOf(Array).of.length(1);
    });
    cy.get('[todolist]').should('exist').should('have.length', 1);
  });
});
