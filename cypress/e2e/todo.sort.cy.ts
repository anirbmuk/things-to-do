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

describe('Sort TODO', () => {
  const day0 = getStorageDate(addDays());
  const day1 = getStorageDate(addDays(1));
  const day2 = getStorageDate(addDays(2));

  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          data.todos.key,
          JSON.stringify([
            {
              todoid: 'test-todoid-1',
              heading: 'TODO heading 1',
              text: `TODO text ${day0}`,
              status: 'Incomplete',
              duedate: day0
            },
            {
              todoid: 'test-todoid-2',
              heading: 'TODO heading 2',
              text: `TODO text ${day1}`,
              status: 'Incomplete',
              duedate: day1
            },
            {
              todoid: 'test-todoid-3',
              heading: 'TODO heading 3',
              text: `TODO text ${day2}`,
              status: 'Incomplete',
              duedate: day2
            }
          ])
        );
      }
    });
    cy.get('[data-test-id=showallshow]').click();
    cy.get('[data-test-id=groupbymonth]').click();
  });

  it('should initially sort in ascending order of duedate', () => {
    cy.get('[todolistitem]').should('exist').should('have.length', 3);

    cy.get('[todolistitem]')
      .eq(0)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 1');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${day0}`);
      });
    cy.get('[todolistitem]')
      .eq(1)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 2');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${day1}`);
      });
    cy.get('[todolistitem]')
      .eq(2)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 3');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${day2}`);
      });
  });

  it('should push completed TODOs to end-of-group', () => {
    cy.log('Mark first TODO as done');
    cy.get('[data-test-id=togglestatus]').eq(0).click();
    cy.wait(250);

    cy.get('[todolistitem]')
      .eq(0)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 2');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${day1}`);
      });
    cy.get('[todolistitem]')
      .eq(1)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 3');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${day2}`);
      });
    cy.get('[todolistitem]')
      .eq(2)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 1');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${day0}`);
      });

    cy.log('Mark second TODO as done');
    cy.get('[data-test-id=togglestatus]').eq(0).click();
    cy.wait(250);

    cy.get('[todolistitem]')
      .eq(0)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 3');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${day2}`);
      });
    cy.get('[todolistitem]')
      .eq(1)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 1');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${day0}`);
      });
    cy.get('[todolistitem]')
      .eq(2)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 2');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${day1}`);
      });
  });

  it('should push incomplete TODOs to top-of-group', () => {
    cy.log('Mark all TODOs as done');
    cy.get('[data-test-id=togglestatus]').each((toggle) => {
      cy.wrap(toggle).click();
    });
    cy.wait(250);

    cy.get('[todolistitem]')
      .eq(0)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 1');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${day0}`);
      });
    cy.get('[todolistitem]')
      .eq(1)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 2');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${day1}`);
      });
    cy.get('[todolistitem]')
      .eq(2)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 3');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${day2}`);
      });

    cy.log('Mark first TODO from bottom as Incomplete');
    cy.get('[data-test-id=togglestatus]').eq(2).click();
    cy.wait(250);

    cy.get('[todolistitem]')
      .eq(0)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 3');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${day2}`);
      });
    cy.get('[todolistitem]')
      .eq(1)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 1');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${day0}`);
      });
    cy.get('[todolistitem]')
      .eq(2)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 2');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${day1}`);
      });

    cy.get('[data-test-id=togglestatus]').eq(2).click();
    cy.wait(250);

    cy.get('[todolistitem]')
      .eq(0)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 2');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${day1}`);
      });
    cy.get('[todolistitem]')
      .eq(1)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 3');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${day2}`);
      });
    cy.get('[todolistitem]')
      .eq(2)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'TODO heading 1');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', `TODO text ${day0}`);
      });
  });
});
