import * as data from '../fixtures/data.json';

describe('E2E for Things-TODO', () => {
  describe('Test routing', () => {
    it('should redirect to notfound', () => {
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

  describe('Test Header', () => {
    it('should show correct app title', () => {
      cy.visit('/');

      cy.get('[data-test-id=titlelink]').should('contain.text', 'Things TODO');
    });

    it('should display action buttons', () => {
      cy.visit('/');

      cy.get('[data-test-id=showsearch]').should('exist');
      cy.get('[data-test-id=addtodobtn]').should('exist');
    });

    it('should correctly toggle input search field', () => {
      cy.visit('/');

      cy.get('[data-test-id=showsearch]').click();
      cy.get('[data-test-id=showsearch]').should('not.exist');
      cy.get('[data-test-id=inputsearch]').should('exist');
      cy.get('[data-test-id=clearsearch]').should('exist');

      cy.get('[data-test-id=clearsearch]').click();
      cy.get('[data-test-id=showsearch]').should('exist');
      cy.get('[data-test-id=inputsearch]').should('not.exist');
      cy.get('[data-test-id=clearsearch]').should('not.exist');
    });

    it('should open modal on clicking add icon', () => {
      cy.visit('/');

      cy.get('[data-test-id=addtodobtn]').click();
      cy.get('[data-test-id=createupdatemodal]').should('exist');
    });
  });

  describe('TODO', () => {
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

      cy.get('[list]').should('exist').should('have.length', 1);
      const listitem = cy.get('[list]').get('[listitem]');
      listitem.get('[heading]').should('contain.text', data.todos.new.heading);
      listitem.get('[text]').should('contain.text', data.todos.new.text);
      listitem
        .get('[status]')
        .should('contain.text', `${data.months[+mm - 1]} ${dd}, ${yyyy}`);
      listitem.get('[additional]').should('contain.text', 'Due today');
    });

    it('should toggle TODO status', () => {
      const today = new Date();
      const dd = `${today.getDate()}`.padStart(2, '0');
      const mm = `${today.getMonth() + 1}`.padStart(2, '0');
      const yyyy = `${today.getFullYear()}`.padStart(2, '0');
      const time = '20:00:00';
      const duedate = `${yyyy}-${mm}-${dd}T${time}`;

      cy.createtodo(data.todos.new.heading, data.todos.new.text, duedate);

      cy.get('[data-test-id=showallshow]').click();
      cy.get('[data-test-id=togglestatus').click();

      const listitem = cy.get('[list]').get('[listitem]');
      listitem.get('[status]').should('not.exist');
      listitem.get('[additional]').should('not.exist');
      listitem.get('[performance]').should('contain.text', 'Completed on time');

      cy.get('[data-test-id=togglestatus').click();
      listitem
        .get('[status]')
        .should('contain.text', `${data.months[+mm - 1]} ${+dd}, ${yyyy}`);
      listitem.get('[additional]').should('contain.text', 'Due today');
      listitem.get('[performance]').should('not.exist');
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

      const listitem = cy.get('[list]').get('[listitem]');
      listitem.click();

      cy.get('[data-test-id=createupdatemodal]').should('exist');
      cy.get('[data-test-id=createupdatemodal-heading]').should('be.disabled');
      cy.get('[data-test-id=createupdatemodal-text]').should('be.disabled');
      cy.get('[data-test-id=createupdatemodal-duedate]').should('be.disabled');
      cy.get('[data-test-id=createupdatemodal-save]').should('be.disabled');
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

      cy.get('[list]').should('exist').should('have.length', 1);
      const listitem = cy.get('[list]').get('[listitem]');
      listitem.get('[heading]').should('contain.text', data.todos.new.heading);
      listitem.get('[text]').should('contain.text', data.todos.new.text);
      listitem
        .get('[status]')
        .should('contain.text', `${data.months[+mm - 1]} ${+dd}, ${yyyy}`);
      listitem.get('[additional]').should('contain.text', 'Due later');
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

      cy.get('[list]').should('exist').should('have.length', 1);
      const listitem = cy.get('[list]').get('[listitem]');
      listitem.get('[heading]').should('contain.text', 'Past TODO heading');
      listitem.get('[text]').should('contain.text', 'Past TODO text');
      listitem.get('[status]').should('contain.text', 'Jan 1, 2020');
      listitem.get('[additional]').should('contain.text', 'Past due date');

      cy.get('[data-test-id=togglestatus').click();
      listitem.get('[status]').should('not.exist');
      listitem.get('[additional]').should('not.exist');
      listitem
        .get('[performance]')
        .should('contain.text', 'Task was delayed :-(');
    });
  });
});
