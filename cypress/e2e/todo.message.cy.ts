import * as data from '../fixtures/data.json';

describe('Pending TODO messages', () => {
  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          data.todos.key,
          JSON.stringify([
            {
              todoid: 'test-todoid-1',
              heading: 'TODO heading 1',
              text: 'TODO text 1',
              status: 'Incomplete',
              duedate: '2020-01-01T12:00:00.000Z'
            },
            {
              todoid: 'test-todoid-2',
              heading: 'TODO heading 2',
              text: 'TODO text 2',
              status: 'Incomplete',
              duedate: '2020-01-01T12:00:00.000Z'
            },
            {
              todoid: 'test-todoid-3',
              heading: 'TODO heading 3',
              text: 'TODO text 3',
              status: 'Incomplete',
              duedate: '2020-01-02T12:00:00.000Z'
            }
          ])
        );
      }
    });
    cy.get('[data-test-id=showallshow]').click();
  });

  it('should show correct pending labels for incomplete TODOs with groupby day', () => {
    cy.get('[todolist]').should('exist');
    cy.get('[data-test-id=totalpending]').should(
      'contain.text',
      '3 pending TODOs'
    );

    cy.get('[data-test-id=grouppending]').should('have.length', 2);
    cy.get('[data-test-id=grouppending]').each((grouppending, index) => {
      if (index === 0) {
        cy.wrap(grouppending).should('contain.text', '2 pending TODOs');
      } else if (index === 1) {
        cy.wrap(grouppending).should('contain.text', '1 pending TODO');
      }
    });

    cy.log('Mark all TODOs as Complete');
    cy.get('[data-test-id=togglestatus]').each((button) => {
      cy.wrap(button).click();
    });
    cy.wait(250);

    cy.get('[data-test-id=grouppending]').should('not.exist');
    cy.get('[data-test-id=totalpending]').should(
      'contain.text',
      'All caught up'
    );
  });

  it('should show correct pending labels for incomplete TODOs with groupby month', () => {
    cy.get('[data-test-id=groupbymonth]').click();
    cy.wait(250);
    cy.get('[todolist]').should('exist');
    cy.get('[data-test-id=totalpending]').should(
      'contain.text',
      '3 pending TODOs'
    );

    cy.get('[data-test-id=grouppending]').should('have.length', 1);
    cy.get('[data-test-id=grouppending]').should(
      'contain.text',
      '3 pending TODOs'
    );

    cy.log('Mark all TODOs as Complete');
    cy.get('[data-test-id=togglestatus]').each((button) => {
      cy.wrap(button).click();
    });
    cy.wait(250);

    cy.get('[data-test-id=grouppending]').should('not.exist');
    cy.get('[data-test-id=totalpending]').should(
      'contain.text',
      'All caught up'
    );
  });
});
