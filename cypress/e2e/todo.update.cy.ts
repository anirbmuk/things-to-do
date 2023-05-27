import * as data from '../fixtures/data.json';

describe('Update TODO', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.clearAllLocalStorage();
  });

  it('should toggle TODO status', () => {
    const today = new Date();
    const dd = `${today.getDate()}`.padStart(2, '0');
    const mm = `${today.getMonth() + 1}`.padStart(2, '0');
    const yyyy = today.getFullYear();
    const time = '20:00:00';
    const duedate = `${yyyy}-${mm}-${dd}T${time}`;

    cy.createtodo(data.todos.new.heading, data.todos.new.text, duedate);

    cy.get('[data-test-id=showallshow]').click();
    cy.get('[data-test-id=togglestatus').click();

    const listitem = cy.get('[todolist]').get('[todolistitem]');
    listitem.get('[todostatus]').should('not.exist');
    listitem.get('[todoadditional]').should('not.exist');
    listitem
      .get('[todoperformance]')
      .should('contain.text', 'Completed on time');

    cy.get('[data-test-id=togglestatus').click();
    listitem
      .get('[todostatus]')
      .should('contain.text', `${data.months[+mm - 1]} ${+dd}, ${yyyy}`);
    listitem.get('[todoadditional]').should('contain.text', 'Due today');
    listitem.get('[todoperformance]').should('not.exist');
  });

  it('should not allow to edit Completed TODO', () => {
    const today = new Date();
    const dd = `${today.getDate()}`.padStart(2, '0');
    const mm = `${today.getMonth() + 1}`.padStart(2, '0');
    const yyyy = today.getFullYear();
    const time = '20:00:00';
    const duedate = `${yyyy}-${mm}-${dd}T${time}`;

    cy.createtodo(data.todos.new.heading, data.todos.new.text, duedate);

    cy.get('[data-test-id=showallshow]').click();
    cy.get('[data-test-id=togglestatus').click();

    const listitem = cy.get('[todolist]').get('[todolistitem]');
    listitem.click();

    cy.get('[data-test-id=createupdatemodal]').should('exist');
    cy.get('[data-test-id=createupdatemodal-heading]').should('be.disabled');
    cy.get('[data-test-id=createupdatemodal-text]').should('be.disabled');
    cy.get('[data-test-id=createupdatemodal-duedate]').should('be.disabled');
    cy.get('[data-test-id=createupdatemodal-save]').should('be.disabled');
  });

  it('should correctly toggle past TODO', () => {
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

    cy.getAllLocalStorage({ log: true }).then((result) => {
      const domainKeys = result['http://localhost:4200'];
      const output = JSON.parse(domainKeys[data.todos.key] as string);
      expect(output).to.be.instanceOf(Array).of.length(1);

      expect(output[0]['status']).to.equal('Incomplete');
      expect(output[0]['heading']).to.equal('Past TODO heading');
      expect(output[0]['text']).to.equal('Past TODO text');
      expect(output[0]['todoid']).to.equal('test-past-todoid');
    });

    cy.get('[todolist]').should('exist').should('have.length', 1);
    const listitem = cy.get('[todolist]').get('[todolistitem]');
    listitem.get('[todoheading]').should('contain.text', 'Past TODO heading');
    listitem.get('[todotext]').should('contain.text', 'Past TODO text');
    listitem.get('[todostatus]').should('contain.text', 'Jan 1, 2020');
    listitem.get('[todoadditional]').should('contain.text', 'Past due date');

    cy.get('[data-test-id=togglestatus').click();
    listitem.get('[todostatus]').should('not.exist');
    listitem.get('[todoadditional]').should('not.exist');
    listitem
      .get('[todoperformance]')
      .should('contain.text', 'Task was delayed :-(');
  });

  it('should correctly update selected TODO', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        const today = new Date();
        const dd = `${today.getDate()}`.padStart(2, '0');
        const mm = `${today.getMonth() + 1}`.padStart(2, '0');
        const yyyy1 = today.getFullYear() + 1;
        const yyyy2 = today.getFullYear() + 2;
        const time = '20:00:00.000Z';
        const duedate1 = `${yyyy1}-${mm}-${dd}T${time}`;
        const duedate2 = `${yyyy2}-${mm}-${dd}T${time}`;
        win.localStorage.setItem(
          data.todos.key,
          JSON.stringify([
            {
              todoid: 'test-future-todoid-1',
              heading: 'Future TODO heading 1',
              text: 'Future TODO text (one year later)',
              status: 'Incomplete',
              duedate: duedate1
            },
            {
              todoid: 'test-future-todoid-2',
              heading: 'Future TODO heading 2',
              text: 'Future TODO text (two years later)',
              status: 'Incomplete',
              duedate: duedate2
            }
          ])
        );
      }
    });

    cy.get('[data-test-id=showallshow]').click();
    cy.get('[todolistitem]').should('exist').should('have.length', 2);

    cy.log('Edit first item');
    cy.get('[todolistitem]').eq(0).click();
    cy.wait(250);

    cy.get('[data-test-id=createupdatemodal-heading]').click().clear();
    cy.get('[data-test-id=createupdatemodal-heading]')
      .click()
      .type('Updated future TODO heading 1');
    cy.get('[data-test-id=createupdatemodal-text]').click().clear();
    cy.get('[data-test-id=createupdatemodal-text]')
      .click()
      .type('Future TODO text (exactly one year later)');
    cy.get('[data-test-id=createupdatemodal-save]').click();
    cy.wait(250);

    cy.getAllLocalStorage({ log: true }).then((result) => {
      const domainKeys = result['http://localhost:4200'];
      const output = JSON.parse(domainKeys[data.todos.key] as string);
      expect(output).to.be.instanceOf(Array).of.length(2);

      cy.log(
        'Always check the last element of the array, as the updated item is pushed to the end'
      );
      expect(output[1]['heading']).to.equal('Updated future TODO heading 1');
      expect(output[1]['text']).to.equal(
        'Future TODO text (exactly one year later)'
      );
    });

    cy.get('[todolistitem]')
      .eq(0)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'Updated future TODO heading 1');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', 'Future TODO text (exactly one year later)');
      });

    cy.log('Edit second item');
    cy.get('[todolistitem]').eq(1).click();
    cy.wait(250);

    cy.get('[data-test-id=createupdatemodal-heading]').click().clear();
    cy.get('[data-test-id=createupdatemodal-heading]')
      .click()
      .type('Updated future TODO heading 2');
    cy.get('[data-test-id=createupdatemodal-text]').click().clear();
    cy.get('[data-test-id=createupdatemodal-text]')
      .click()
      .type('Future TODO text (exactly two years later)');
    cy.get('[data-test-id=createupdatemodal-save]').click();
    cy.wait(250);

    cy.getAllLocalStorage({ log: true }).then((result) => {
      const domainKeys = result['http://localhost:4200'];
      const output = JSON.parse(domainKeys[data.todos.key] as string);
      expect(output).to.be.instanceOf(Array).of.length(2);

      cy.log(
        'Always check the last element of the array, as the updated item is pushed to the end'
      );
      expect(output[1]['heading']).to.equal('Updated future TODO heading 2');
      expect(output[1]['text']).to.equal(
        'Future TODO text (exactly two years later)'
      );
    });

    cy.get('[todolistitem]')
      .eq(1)
      .then((listitem) => {
        cy.wrap(listitem)
          .find('[todoheading]')
          .should('contain.text', 'Updated future TODO heading 2');
        cy.wrap(listitem)
          .find('[todotext]')
          .should('contain.text', 'Future TODO text (exactly two years later)');
      });
  });
});
