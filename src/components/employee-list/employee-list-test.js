import { fixture, html, expect } from '@open-wc/testing';
import store from '../../store/employee-store.js';
import './employee-list.js';
import { Router } from '@vaadin/router';

suite('EmployeeList', () => {
  let el;
  setup(async() => {
    el = await fixture(html`<employee-list></employee-list>`);
    store.getState().employees = [
      {
        id: 1,
        firstName: 'Victoria',
        lastName: 'Roberts',
        dateOfBirth: '1990-05-20',
        dateOfEmployment: '2020-01-01',
        phone: '(555) 522 77 88',
        email: 'victoria.roberts@mail.com',
        department: 'Analytics',
        position: 'Medior',
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Doe',
        dateOfBirth: '1985-08-12',
        dateOfEmployment: '2019-03-10',
        phone: '(555) 411 56 99',
        email: 'jane@example.com',
        department: 'Tech',
        position: 'Junior',
      },
    ];
  });

  test('should render employee list table view by default', async() => {
    const table = el.shadowRoot.querySelector('[data-test-id="table"]');
    expect(table).to.exist;
  });

  test('should switch to list view when list button is clicked', async() => {
    const listButton = el.shadowRoot.querySelector(
      '[data-test-id="list-view"]'
    );
    listButton.click();
    await el.updateComplete;
    const cardList = el.shadowRoot.querySelector('[data-test-id="card-list"]');
    expect(cardList).to.exist;
  });

  test('should filter employees by search input', async() => {
    const searchInput = el.shadowRoot.querySelector(
      '[data-test-id="search-box"]'
    );
    searchInput.value = 'Victoria';
    searchInput.dispatchEvent(new Event('input'));
    await el.updateComplete;
    const rows = el.shadowRoot.querySelectorAll('tbody tr');
    expect(rows[0].textContent).to.include('Victoria');
  });

  test('should open confirm dialog on delete button click', async() => {
    const deleteButton = el.shadowRoot.querySelector(
      '[data-test-id="delete-action-button"]'
    );
   
    deleteButton.click();
    await el.updateComplete;
    const dialog = el.shadowRoot.querySelector('confirm-dialog');
    expect(dialog.isOpen).to.be.true;
  });

  test('should sort employees when column header is clicked', async() => {
    const firstNameHeader = el.shadowRoot.querySelector('th.sortable');
    firstNameHeader.click();
    await el.updateComplete;
    expect(el.sortColumn).to.equal('firstName');
    expect(el.sortOrder).to.equal('asc');
  });

  test('pagination buttons update currentPage and active class', async() => {
      store.getState().employees = Array.from({ length: 20 }, (_, i) => ({
          id: i + 1,
          firstName: `Name${i + 1}`,
          lastName: `Last${i + 1}`,
          dateOfBirth: '1990-01-01',
          dateOfEmployment: '2020-01-01',
          phone: '(555) 522 77 88',
          email: `email${i + 1}@example.com`,
          department: 'Tech',
          position: 'Senior',
      }));

      const el = await fixture(html`<employee-list></employee-list>`);
      await el.updateComplete;

      expect(el.currentPage).to.equal(1);

      const secondPageButton = [...el.shadowRoot.querySelectorAll('.page-number')].find(
          (btn) => btn.textContent.trim() === '2'
      );
      expect(secondPageButton).to.exist;

      secondPageButton.click();

      await el.updateComplete;  

      expect(el.currentPage).to.equal(2);

      const newActiveButton = el.shadowRoot.querySelector('.page-number.active');
      expect(newActiveButton).to.exist;
      expect(newActiveButton.textContent.trim()).to.equal('2');
  });

  test('selects all employees when toggleSelectAll is checked', async() => {
      const selectAllCheckbox = el.shadowRoot.querySelector(
        '[data-test-id="select-all-checkbox"]'
      );

      selectAllCheckbox.checked = true;
      selectAllCheckbox.dispatchEvent(new Event('change'));

      expect(el.selectedEmployees).to.have.members([1, 2]);
      expect(el.allSelected).to.be.true;

      selectAllCheckbox.checked = false;
      selectAllCheckbox.dispatchEvent(new Event('change'));

      expect(el.selectedEmployees.length).to.equal(0);
      expect(el.allSelected).to.be.false;
  });

  test('clicking update button navigates to correct edit employee page', async() => {
    const originalGo = Router.go;
    let navigatedTo = null;
    Router.go = (path) => {
      navigatedTo = path;
    };

    const originalGetState = store.getState;
    store.getState = () => ({
      employees: [
        {
          id: 1234567890,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '(555) 123 45 67',
          dateOfBirth: '1990-01-01',
          dateOfEmployment: '2020-01-01',
          department: 'Tech',
          position: 'Senior',
        },
        {
          id: 9876543210,
          firstName: 'Olivia',
          lastName: 'Robert',
          email: 'same@mail.com',
          phone: '(555) 987 65 43',
          dateOfBirth: '1990-01-01',
          dateOfEmployment: '2020-01-01',
          department: 'Tech',
          position: 'Medior',
        },
      ],
    });

    const el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;

    const updateButton = el.shadowRoot.querySelector(
      'button[data-test-id="update-action-button-1234567890"]'
    );
    expect(updateButton).to.exist;

    updateButton.click();
    await el.updateComplete;

    expect(navigatedTo).to.equal('/edit-employee/1234567890');
    Router.go = originalGo;
    store.getState = originalGetState;
  });

  test('should open confirmation modal and delete employee on proceed', async() => {
    let employees = [
      {
        id: 1234567890,
        firstName: 'Test',
        lastName: 'User',
        email: 'test.user@mail.com',
        phone: '(555) 000 11 22',
        dateOfBirth: '1990-01-01',
        dateOfEmployment: '2020-01-01',
        department: 'Tech',
        position: 'Junior',
      },
    ];

    store.getState = () => ({ employees });

    const el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;

    const deleteButton = el.shadowRoot.querySelector('[data-test-id="delete-action-button"]');
    expect(deleteButton).to.exist;

    deleteButton.click();
    await el.updateComplete;

    const modal = el.shadowRoot.querySelector('confirm-dialog');
    expect(modal).to.exist;
    expect(modal.isOpen).to.be.true;

    const originalDispatch = store.dispatch;
    let dispatchedAction = null;

    store.dispatch = (action) => {
      dispatchedAction = action;
      if (action.type === 'employees/deleteEmployee') {
        employees = employees.filter((e) => e.id !== action.payload);
      }
      return { payload: true };
    };

    const proceedButton = modal.shadowRoot.querySelector('[data-test-id="proceed-button"]');
    expect(proceedButton).to.exist;

    proceedButton.click();
    await el.updateComplete;

    expect(dispatchedAction.type).to.equal('employees/deleteEmployee');
    expect(dispatchedAction.payload).to.equal(1234567890);

    const deletedRow = el.shadowRoot.querySelector('[data-test-id="employee-row-1234567890"]');
    expect(deletedRow).to.not.exist;

    store.dispatch = originalDispatch;
  });
});
