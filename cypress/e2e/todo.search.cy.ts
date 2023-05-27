import * as data from '../fixtures/data.json';

const addDays = (days = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const getStorageDate = (date: Date) => {
  const dd = `${date.getDate()}`.padStart(2, '0');
  const mm = `${date.getMonth() + 1}`.padStart(2, '0');
  const yyyy1 = date.getFullYear();
  const time = '20:00:00.000Z';
  return `${yyyy1}-${mm}-${dd}T${time}`;
};

describe('Search TODO', () => {
  const day_1 = getStorageDate(addDays(-1));
  const day_2 = getStorageDate(addDays(-2));
  const day0 = getStorageDate(addDays());
  const day1 = getStorageDate(addDays(1));
  const day2 = getStorageDate(addDays(2));
  const day3 = getStorageDate(addDays(3));
  const day4 = getStorageDate(addDays(4));
  const daynextweek = getStorageDate(addDays(7));
  const daynextyear = getStorageDate(addDays(366));

  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          data.todos.key,
          JSON.stringify([
            {
              todoid: 'test-todoid-1',
              heading: 'TODO heading 1',
              text: `TODO text ${day_2}`,
              status: 'Incomplete',
              duedate: day_2
            },
            {
              todoid: 'test-todoid-2',
              heading: 'TODO heading 2',
              text: `TODO text ${day_1}`,
              status: 'Incomplete',
              duedate: day_1
            },
            {
              todoid: 'test-todoid-3',
              heading: 'TODO heading 3',
              text: `TODO text ${day0}`,
              status: 'Incomplete',
              duedate: day0
            },
            {
              todoid: 'test-todoid-4',
              heading: 'TODO heading 4',
              text: `TODO text ${day1}`,
              status: 'Incomplete',
              duedate: day1
            },
            {
              todoid: 'test-todoid-5',
              heading: 'TODO heading 5',
              text: `TODO text ${day2}`,
              status: 'Incomplete',
              duedate: day2
            },
            {
              todoid: 'test-todoid-6',
              heading: 'TODO heading 6',
              text: `TODO text ${day3}`,
              status: 'Incomplete',
              duedate: day3
            },
            {
              todoid: 'test-todoid-7',
              heading: 'TODO heading 7',
              text: `TODO text ${day4}`,
              status: 'Incomplete',
              duedate: day4
            },
            {
              todoid: 'test-todoid-8',
              heading: 'TODO heading 8',
              text: `TODO text ${daynextweek}`,
              status: 'Incomplete',
              duedate: daynextweek
            },
            {
              todoid: 'test-todoid-9',
              heading: 'TODO heading 9',
              text: `TODO text ${daynextyear}`,
              status: 'Incomplete',
              duedate: daynextyear
            }
          ])
        );
      }
    });
    cy.get('[data-test-id=showallshow]').click();
    cy.get('[data-test-id=showsearch]').click();
  });

  it('should search for a text', () => {
    cy.get('[data-test-id=inputsearch]').click();
    cy.get('[data-test-id=inputsearch]').type('todo heading 1');
    cy.get('[todolistitem]').should('exist').should('have.length', 1);
    cy.get('[todolistitem]')
      .eq(0)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 1');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${day_2}`);
      });
  });

  it('should search for a due label', () => {
    cy.get('[data-test-id=inputsearch]').click();
    cy.get('[data-test-id=inputsearch]').type('past due date');
    cy.get('[todolistitem]').should('exist').should('have.length', 2);
    cy.get('[todolistitem]')
      .eq(0)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 1');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${day_2}`);
      });
    cy.get('[todolistitem]')
      .eq(1)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 2');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${day_1}`);
      });

    cy.get('[data-test-id=inputsearch]').click();
    cy.get('[data-test-id=inputsearch]').clear();
    cy.get('[data-test-id=inputsearch]').type('due tomorrow');
    cy.get('[todolistitem]').should('exist').should('have.length', 1);
    cy.get('[todolistitem]')
      .eq(0)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 4');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${day1}`);
      });

    cy.get('[data-test-id=inputsearch]').click();
    cy.get('[data-test-id=inputsearch]').clear();
    cy.get('[data-test-id=inputsearch]').type('next week');
    cy.get('[todolistitem]').should('exist').should('have.length', 1);
    cy.get('[todolistitem]')
      .eq(0)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 8');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${daynextweek}`);
      });

    cy.get('[data-test-id=inputsearch]').click();
    cy.get('[data-test-id=inputsearch]').clear();
    cy.get('[data-test-id=inputsearch]').type('later');
    cy.get('[todolistitem]').should('exist').should('have.length', 1);
    cy.get('[todolistitem]')
      .eq(0)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 9');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${daynextyear}`);
      });
  });

  it('should search with arithmetic operators', () => {
    cy.log('Testing for eq');
    cy.get('[data-test-id=inputsearch]').click();
    cy.get('[data-test-id=inputsearch]').type('eq 0');
    cy.get('[todolistitem]').should('exist').should('have.length', 1);
    cy.get('[todolistitem]')
      .eq(0)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 3');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${day0}`);
      });
    cy.get('[data-test-id=inputsearch]').click();
    cy.get('[data-test-id=inputsearch]').clear();
    cy.get('[data-test-id=inputsearch]').type('eq -1');
    cy.get('[todolistitem]').should('exist').should('have.length', 1);
    cy.get('[todolistitem]')
      .eq(0)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 2');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${day_1}`);
      });

    cy.log('Testing for <');
    cy.get('[data-test-id=inputsearch]').click();
    cy.get('[data-test-id=inputsearch]').clear();
    cy.get('[data-test-id=inputsearch]').type('< 0');
    cy.get('[todolistitem]').should('exist').should('have.length', 2);
    cy.get('[todolistitem]')
      .eq(0)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 1');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${day_2}`);
      });
    cy.get('[todolistitem]')
      .eq(1)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 2');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${day_1}`);
      });

    cy.log('Testing for >');
    cy.get('[data-test-id=inputsearch]').click();
    cy.get('[data-test-id=inputsearch]').clear();
    cy.get('[data-test-id=inputsearch]').type('> 6');
    cy.get('[todolistitem]').should('exist').should('have.length', 2);
    cy.get('[todolistitem]')
      .eq(0)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 8');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${daynextweek}`);
      });
    cy.get('[todolistitem]')
      .eq(1)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 9');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${daynextyear}`);
      });

    cy.log('Testing for <=');
    cy.get('[data-test-id=inputsearch]').click();
    cy.get('[data-test-id=inputsearch]').clear();
    cy.get('[data-test-id=inputsearch]').type('<= 1');
    cy.get('[todolistitem]').should('exist').should('have.length', 4);
    cy.get('[todolistitem]')
      .eq(0)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 1');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${day_2}`);
      });
    cy.get('[todolistitem]')
      .eq(1)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 2');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${day_1}`);
      });
    cy.get('[todolistitem]')
      .eq(2)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 3');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${day0}`);
      });
    cy.get('[todolistitem]')
      .eq(3)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 4');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${day1}`);
      });

    cy.log('Testing for >=');
    cy.get('[data-test-id=inputsearch]').click();
    cy.get('[data-test-id=inputsearch]').clear();
    cy.get('[data-test-id=inputsearch]').type('>= 3');
    cy.get('[todolistitem]').should('exist').should('have.length', 4);
    cy.get('[todolistitem]')
      .eq(0)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 6');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${day3}`);
      });
    cy.get('[todolistitem]')
      .eq(1)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 7');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${day4}`);
      });
    cy.get('[todolistitem]')
      .eq(2)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 8');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${daynextweek}`);
      });
    cy.get('[todolistitem]')
      .eq(3)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 9');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${daynextyear}`);
      });
  });
});
