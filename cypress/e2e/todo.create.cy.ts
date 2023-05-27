import * as data from '../fixtures/data.json';

describe('Create TODO', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.clearAllLocalStorage();
  });

  it('should create a new TODO', () => {
    const today = new Date();
    const dd = `${today.getDate()}`.padStart(2, '0');
    const mm = `${today.getMonth() + 1}`.padStart(2, '0');
    const yyyy = `${today.getFullYear()}`.padStart(2, '0');
    const time = '20:00:00';
    const duedate = `${yyyy}-${mm}-${dd}T${time}`;

    cy.createtodo(data.todos.new.heading, data.todos.new.text, duedate);

    cy.getAllLocalStorage({ log: true }).then((result) => {
      const domainKeys = result['http://localhost:4200'];
      const output = JSON.parse(domainKeys[data.todos.key] as string);
      expect(output).to.be.instanceOf(Array).of.length(1);

      expect(output[0]['status']).to.equal('Incomplete');
      expect(output[0]['heading']).to.equal(data.todos.new.heading);
      expect(output[0]['text']).to.equal(data.todos.new.text);
      expect(output[0]['todoid']).to.be.not.null;
    });

    cy.get('[todolist]').should('exist').should('have.length', 1);
    const listitem = cy.get('[todolist]').get('[todolistitem]');
    listitem
      .get('[todoheading]')
      .should('contain.text', data.todos.new.heading);
    listitem.get('[todotext]').should('contain.text', data.todos.new.text);
    listitem
      .get('[todostatus]')
      .should('contain.text', `${data.months[+mm - 1]} ${dd}, ${yyyy}`);
    listitem.get('[todoadditional]').should('contain.text', 'Due today');
  });

  it('should create future TODO', () => {
    const today = new Date();
    const dd = '01';
    const mm = '01';
    const yyyy = today.getFullYear() + 1;
    const time = '20:00:00';
    const duedate = `${yyyy}-${mm}-${dd}T${time}`;

    cy.createtodo(data.todos.new.heading, data.todos.new.text, duedate);

    cy.getAllLocalStorage({ log: true }).then((result) => {
      const domainKeys = result['http://localhost:4200'];
      const output = JSON.parse(domainKeys[data.todos.key] as string);
      expect(output).to.be.instanceOf(Array).of.length(1);

      expect(output[0]['status']).to.equal('Incomplete');
      expect(output[0]['heading']).to.equal(data.todos.new.heading);
      expect(output[0]['text']).to.equal(data.todos.new.text);
      expect(output[0]['todoid']).to.be.not.null;
    });

    cy.get('[todolist]').should('exist').should('have.length', 1);
    const listitem = cy.get('[todolist]').get('[todolistitem]');
    listitem
      .get('[todoheading]')
      .should('contain.text', data.todos.new.heading);
    listitem.get('[todotext]').should('contain.text', data.todos.new.text);
    listitem
      .get('[todostatus]')
      .should('contain.text', `${data.months[+mm - 1]} ${+dd}, ${yyyy}`);
    listitem.get('[todoadditional]').should('contain.text', 'Due later');

    cy.get('[data-test-id=showallshow]').click();
    cy.get('[data-test-id=togglestatus').click();
    listitem.get('[todostatus]').should('not.exist');
    listitem.get('[todoadditional]').should('not.exist');
    listitem
      .get('[todoperformance]')
      .should('contain.text', 'Completed before due date :-)');
  });

  it('should create multiple TODOs', () => {
    const today = new Date();
    const dd1 = `${today.getDate()}`.padStart(2, '0');
    const mm1 = `${today.getMonth() + 1}`.padStart(2, '0');
    const yyyy1 = today.getFullYear();
    const time = '20:00:00';
    let duedate = `${yyyy1}-${mm1}-${dd1}T${time}`;

    cy.createtodo(data.todos.new.heading, data.todos.new.text, duedate);

    const dd2 = '01';
    const mm2 = '01';
    const yyyy2 = today.getFullYear() + 1;
    duedate = `${yyyy2}-${mm2}-${dd2}T${time}`;

    cy.createtodo(data.todos.alt.heading, data.todos.alt.text, duedate);

    cy.getAllLocalStorage({ log: true }).then((result) => {
      const domainKeys = result['http://localhost:4200'];
      const output = JSON.parse(domainKeys[data.todos.key] as string);
      expect(output).to.be.instanceOf(Array).of.length(2);
    });

    cy.get('[todolist]').should('exist').should('have.length', 2);

    cy.get('[todolist]').each((listitem, index) => {
      cy.wrap(listitem).should('exist');
      cy.wrap(listitem)
        .find('[todoheading]')
        .should(
          'contain.text',
          data.todos[index === 0 ? 'new' : 'alt'].heading
        );
      cy.wrap(listitem)
        .find('[todotext]')
        .should('contain.text', data.todos[index === 0 ? 'new' : 'alt'].text);
      if (index === 0) {
        cy.wrap(listitem)
          .find('[todostatus]')
          .should('contain.text', `${data.months[+mm1 - 1]} ${+dd1}, ${yyyy1}`);
        cy.wrap(listitem)
          .find('[todoadditional]')
          .should('contain.text', 'Due today');
      } else {
        cy.wrap(listitem)
          .find('[todostatus]')
          .should('contain.text', `${data.months[+mm2 - 1]} ${+dd2}, ${yyyy2}`);
        cy.wrap(listitem)
          .find('[todoadditional]')
          .should('contain.text', 'Due later');
      }
    });
  });
});
