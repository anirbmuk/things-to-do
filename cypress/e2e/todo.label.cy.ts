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

describe('Label TODO', () => {
  const day_1 = getStorageDate(addDays(-1));
  const day0 = getStorageDate(addDays(0));
  const day1 = getStorageDate(addDays(1));
  const day2 = getStorageDate(addDays(2));
  const day7 = getStorageDate(addDays(7));

  const now = new Date();
  const lastDayOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  ).getDate();
  const daysToLastDayOfMonth = lastDayOfMonth - now.getDate();

  const dayThisMonth = getStorageDate(addDays(daysToLastDayOfMonth));
  const dayNextMonth = getStorageDate(addDays(daysToLastDayOfMonth + 1));
  const daylater = getStorageDate(addDays(60));

  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          data.todos.key,
          JSON.stringify([
            {
              todoid: 'test-todoid--1',
              heading: 'TODO heading -1',
              text: `TODO text ${day_1}`,
              status: 'Incomplete',
              duedate: day_1
            },
            {
              todoid: 'test-todoid-0',
              heading: 'TODO heading 0',
              text: `TODO text ${day0}`,
              status: 'Incomplete',
              duedate: day0
            },
            {
              todoid: 'test-todoid-1',
              heading: 'TODO heading 1',
              text: `TODO text ${day1}`,
              status: 'Incomplete',
              duedate: day1
            },
            {
              todoid: 'test-todoid-2',
              heading: 'TODO heading 2',
              text: `TODO text ${day2}`,
              status: 'Incomplete',
              duedate: day2
            },
            {
              todoid: 'test-todoid-7',
              heading: 'TODO heading 7',
              text: `TODO text ${day7}`,
              status: 'Incomplete',
              duedate: day7
            },
            {
              todoid: 'test-todoid-this',
              heading: 'TODO heading this month',
              text: `TODO text ${dayThisMonth}`,
              status: 'Incomplete',
              duedate: dayThisMonth
            },
            {
              todoid: 'test-todoid-next',
              heading: 'TODO heading next month',
              text: `TODO text ${dayNextMonth}`,
              status: 'Incomplete',
              duedate: dayNextMonth
            },
            {
              todoid: 'test-todoid-later',
              heading: 'TODO heading later',
              text: `TODO text ${daylater}`,
              status: 'Incomplete',
              duedate: daylater
            }
          ])
        );
      }
    });
    cy.get('[data-test-id=showallshow]').click();
    cy.get('[data-test-id=groupbymonth]').click();
  });

  it('should show all labels correctly', () => {
    cy.get('[todolistitem]').should('exist').should('have.length', 8);

    cy.get('[todolistitem]')
      .eq(0)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoadditional]')
          .should('contain.text', 'Past due date');
      });
    cy.get('[todolistitem]')
      .eq(1)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoadditional]')
          .should('contain.text', 'Due today');
      });
    cy.get('[todolistitem]')
      .eq(2)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoadditional]')
          .should('contain.text', 'Due tomorrow');
      });
    cy.get('[todolistitem]')
      .eq(3)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoadditional]')
          .should('contain.text', 'Due in 2 days');
      });
    cy.get('[todolistitem]')
      .eq(4)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoadditional]')
          .should('contain.text', 'Due next week');
      });
    cy.get('[todolistitem]')
      .eq(5)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoadditional]')
          .should('contain.text', 'Due this month');
      });
    cy.get('[todolistitem]')
      .eq(6)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoadditional]')
          .should('contain.text', 'Due next month');
      });
    cy.get('[todolistitem]')
      .eq(7)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoadditional]')
          .should('contain.text', 'Due later');
      });
  });
});
