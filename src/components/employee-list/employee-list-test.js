import { fixture, html, expect } from '@open-wc/testing';
import store from '../../store/employee-store.js';
import './employee-list.js';

suite('EmployeeList', () => {
  setup(() => {
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
    const el = await fixture(html`<employee-list></employee-list>`);
    const table = el.shadowRoot.querySelector('[data-test-id="table"]');
    expect(table).to.exist;
  });

  test('should switch to list view when list button is clicked', async() => {
    const el = await fixture(html`<employee-list></employee-list>`);
    const listButton = el.shadowRoot.querySelector(
      '[data-test-id="list-view"]'
    );
    listButton.click();
    await el.updateComplete;
    const cardList = el.shadowRoot.querySelector('[data-test-id="card-list"]');
    expect(cardList).to.exist;
  });

  test('should filter employees by search input', async() => {
    const el = await fixture(html`<employee-list></employee-list>`);
    const searchInput = el.shadowRoot.querySelector(
      '[data-test-id="search-box"]'
    );
    searchInput.value = 'Victoria';
    searchInput.dispatchEvent(new Event('input'));
    await el.updateComplete;
    const rows = el.shadowRoot.querySelectorAll('tbody tr');
    expect(rows.length).to.equal(1);
    expect(rows[0].textContent).to.include('Victoria');
  });

  test('should open confirm dialog on delete button click', async() => {
    const el = await fixture(html`<employee-list></employee-list>`);
    const deleteButtons = el.shadowRoot.querySelectorAll(
      '.table-action-button'
    );
    deleteButtons[1].click();
    await el.updateComplete;
    const dialog = el.shadowRoot.querySelector('confirm-dialog');
    expect(dialog.isOpen).to.be.true;
  });

  test('should sort employees when column header is clicked', async() => {
    const el = await fixture(html`<employee-list></employee-list>`);
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
        const el = await fixture(html`<employee-list></employee-list>`);
        const selectAllCheckbox = el.shadowRoot.querySelector('thead input[type="checkbox"]');

        selectAllCheckbox.checked = true;
        selectAllCheckbox.dispatchEvent(new Event('change'));

        expect(el.selectedEmployees).to.have.members([1, 2]);
        expect(el.allSelected).to.be.true;

        selectAllCheckbox.checked = false;
        selectAllCheckbox.dispatchEvent(new Event('change'));

        expect(el.selectedEmployees.length).to.equal(0);
        expect(el.allSelected).to.be.false;
    });
});
