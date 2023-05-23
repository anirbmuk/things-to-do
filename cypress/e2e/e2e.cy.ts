import * as data from '../fixtures/data.json';

describe('E2E for Things-TODO', () => {
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
            .should(
              'contain.text',
              `${data.months[+mm1 - 1]} ${+dd1}, ${yyyy1}`
            );
          cy.wrap(listitem)
            .find('[todoadditional]')
            .should('contain.text', 'Due today');
        } else {
          cy.wrap(listitem)
            .find('[todostatus]')
            .should(
              'contain.text',
              `${data.months[+mm2 - 1]} ${+dd2}, ${yyyy2}`
            );
          cy.wrap(listitem)
            .find('[todoadditional]')
            .should('contain.text', 'Due later');
        }
      });
    });
  });

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
            .should(
              'contain.text',
              'Future TODO text (exactly one year later)'
            );
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
            .should(
              'contain.text',
              'Future TODO text (exactly two years later)'
            );
        });
    });
  });

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
});
