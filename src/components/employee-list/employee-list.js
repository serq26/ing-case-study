import { LitElement, html } from 'lit';
import { localized, msg, str } from '@lit/localize';
import { Router } from '@vaadin/router';
import sharedStyles from '../../styles/shared-style.js';
import store, {
  deleteEmployee,
  deleteMultipleEmployees,
} from '../../store/employee-store.js';
import '../confirm-dialog/confirm-dialog.js';
import { formatDate, notyf } from '../../lib/utils.js';
import { employeeListStyles } from './employee-list-style.js';

class EmployeeList extends LitElement {
  static properties = {
    search: { type: String },
    currentPage: { type: Number },
    viewType: { type: String },
    employeesPerPage: { type: Number },
    rowsPerPage: { type: Array },
    selectedEmployee: { type: Object },
    selectedEmployees: { type: Array },
    allSelected: { type: Boolean },
    sortColumn: { type: String },
    sortOrder: { type: String },
    columns: { type: Array },
  };

  constructor() {
    super();
    this.search = '';
    this.currentPage = 1;
    this.viewType = 'table';
    this.employeesPerPage = 10;
    this.rowsPerPage = [5, 10, 20, 50, 100];
    this.selectedEmployee = null;
    this.selectedEmployees = [];
    this.allSelected = false;
    this.sortColumn = null;
    this.sortOrder = null;
    this.columns = [
      { key: 'firstName', label: msg('First Name') },
      { key: 'lastName', label: msg('Last Name') },
      { key: 'dateOfBirth', label: msg('Date of Birth') },
      { key: 'dateOfEmployment', label: msg('Date of Employment') },
      { key: 'phone', label: msg('Phone') },
      { key: 'email', label: msg('Email') },
      { key: 'department', label: msg('Department') },
      { key: 'position', label: msg('Position') },
    ];
  }

  static get styles() {
    return [
      sharedStyles,
      employeeListStyles,
    ];
  }

  get filteredEmployees() {
    let filtered = store
      .getState()
      .employees.filter((emp) =>
        `${emp.firstName} ${emp.lastName}`
          .toLowerCase()
          .includes(this.search.toLowerCase())
      );

    if (this.sortColumn && this.sortOrder) {
      filtered = filtered.slice();
      filtered.sort((a, b) => {
        let valA = a[this.sortColumn];
        let valB = b[this.sortColumn];

        if (['dateOfBirth', 'dateOfEmployment'].includes(this.sortColumn)) {
          const timeA = new Date(valA).getTime();
          const timeB = new Date(valB).getTime();
          return this.sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
        }

        if (typeof valA === 'number' && typeof valB === 'number') {
          return this.sortOrder === 'asc' ? valA - valB : valB - valA;
        }

        return this.sortOrder === 'asc'
          ? String(valA).toLowerCase().localeCompare(String(valB).toLowerCase())
          : String(valB)
              .toLowerCase()
              .localeCompare(String(valA).toLowerCase());
      });
    }

    return filtered;
  }

  get paginatedEmployees() {
    const start = (this.currentPage - 1) * this.employeesPerPage;
    return this.filteredEmployees.slice(start, start + this.employeesPerPage);
  }

  handlePerPageChange(e) {
    const selectedValue = parseInt(e.target.value, 10);
    this.employeesPerPage = selectedValue;
    this.currentPage = 1;
  }

  getPageNumbers(current, total, maxVisible) {
    const pages = [];

    if (total <= maxVisible + 2) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    const left = Math.max(1, current - Math.floor(maxVisible / 2));
    const right = Math.min(total, left + maxVisible - 1);

    if (left > 1) {
      pages.push(1);
      if (left > 2) pages.push('...');
    }

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < total) {
      if (right < total - 1) pages.push('...');
      pages.push(total);
    }

    return pages;
  }

  sortBy(column) {
    if (this.sortColumn === column) {
      if (this.sortOrder === 'asc') {
        this.sortOrder = 'desc';
      } else if (this.sortOrder === 'desc') {
        this.sortOrder = null;
        this.sortColumn = null;
      } else {
        this.sortOrder = 'asc';
      }
    } else {
      this.sortColumn = column;
      this.sortOrder = 'asc';
    }
    this.currentPage = 1;
    this.requestUpdate();
  }

  handleDelete(event) {
    if (this.selectedEmployees.length > 0) {
      store.dispatch(deleteMultipleEmployees(this.selectedEmployees));
      notyf.success(this.selectedEmployees.length + ' records deleted!');
      this.selectedEmployees = [];
      this.allSelected = false;
    } else if (this.selectedEmployee) {
      const employee = event.detail;
      store.dispatch(deleteEmployee(employee.id));
      notyf.success(`${employee.firstName} ${employee.lastName} deleted!`);
    } else {
      console.error('No employee to delete');
    }
    
    const totalPages = Math.ceil(
      this.filteredEmployees.length / this.employeesPerPage
    );
    if (this.currentPage > totalPages) {
      this.currentPage = totalPages;
    }
  }

  changeView(type) {
    this.viewType = type;
    this.employeesPerPage = type === 'list' ? 8 : 10;
    this.rowsPerPage =
      type === 'list' ? [4, 8, 16, 32, 64, 96] : [5, 10, 20, 50, 100];
  }

  toggleSelection(e, id) {
    if (e.target.checked) {
      this.selectedEmployees = [...this.selectedEmployees, id];
    } else {
      this.selectedEmployees = this.selectedEmployees.filter((i) => i !== id);
    }

    const allIds = this.paginatedEmployees.map((emp) => emp.id);
    this.allSelected = allIds.every((id) =>
      this.selectedEmployees.includes(id)
    );
  }

  toggleSelectAll(e) {
    const checked = e.target.checked;
    this.allSelected = checked;

    if (checked) {
      this.selectedEmployees = this.paginatedEmployees.map((emp) => emp.id);
    } else {
      this.selectedEmployees = [];
    }
  }

  openModal(employee) {
    this.selectedEmployee = employee;
  }

  handleModalClosed() {
    this.selectedEmployee = null;
  }

  render() {
    return html`
      <div class="container-lg">
        <div style="margin:20px 0">
          <div class="flex-row-between">
            <h2>${msg('Employee List')}</h2>
            <div class="flex-row">
              <div class="actions">
                <button
                  @click="${() => this.changeView('table')}"
                  style="${this.viewType !== 'table' && 'opacity: 0.3'}"
                >
                  <img
                    src="/src/assets/icons/table.svg"
                    alt="Table"
                    width="32"
                    height="32"
                  />
                </button>
                <button
                  @click="${() => this.changeView('list')}"
                  style="${this.viewType !== 'list' && 'opacity: 0.3'}"
                >
                  <img
                    src="/src/assets/icons/list.svg"
                    alt="List"
                    width="32"
                    height="32"
                  />
                </button>
              </div>
            </div>
          </div>
          ${this.viewType === 'list'
            ? html`
                <div
                  style="display:flex;align-items:center;justify-content:flex-end;margin-bottom: 10px"
                >
                  <input
                    class="search-box"
                    type="text"
                    name="search"
                    placeholder="${msg('Search...')}"
                    @input="${(e) => (this.search = e.target.value)}"
                  />
                </div>
              `
            : null}
          ${this.viewType === 'table' ? this.renderTable() : this.renderList()}
          ${this.renderPagination()}
        </div>
      </div>
      <confirm-dialog
        .isOpen=${!!this.selectedEmployee}
        .employee=${this.selectedEmployee}
        @confirm=${this.handleDelete}
        @close=${this.handleModalClosed}
      >
        ${this.selectedEmployees.length > 0
          ? msg(str`${this.selectedEmployees.length} records will be deleted`)
          : msg(
              html`Selected employee record of
                <strong
                  >"${this.selectedEmployee?.firstName}
                  ${this.selectedEmployee?.lastName}"</strong
                >
                will be deleted`
            )}
      </confirm-dialog>
    `;
  }

  renderTable() {
    return html`
      <div class="flex-row-between table-actions">
        <div>
          ${this.selectedEmployees.length > 0
            ? html` <tr>
                <th>
                  <span
                    >${msg(
                      str`${this.selectedEmployees.length} rows selected`
                    )}</span
                  >
                  <button
                    class="delete-button"
                    @click="${() => this.openModal(this.selectedEmployees)}"
                  >
                    ${msg('Delete')}
                  </button>
                </th>
              </tr>`
            : ''}
        </div>
        <input
          class="search-box"
          type="text"
          name="search"
          placeholder="${msg('Search...')}"
          @input="${(e) => (this.search = e.target.value)}"
        />
      </div>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  .checked="${this.allSelected}"
                  @change="${this.toggleSelectAll}"
                />
              </th>
              ${this.columns.map(
                (col) => html`
                  <th
                    class="sortable ${this.sortColumn === col.key
                      ? 'active'
                      : ''}"
                    @click=${() => this.sortBy(col.key)}
                    title="${msg('Sort')}"
                  >
                    ${col.label}
                    <span class="sort-icon">
                      ${this.sortColumn === col.key
                        ? this.sortOrder === 'asc'
                          ? '▲'
                          : this.sortOrder === 'desc'
                          ? '▼'
                          : '⇅'
                        : '⇅'}
                    </span>
                  </th>
                `
              )}
              <th>${msg('Actions')}</th>
            </tr>
          </thead>
          <tbody>
            ${this.paginatedEmployees.map(
              (emp) => html`
                <tr>
                  <td>
                    <input
                      type="checkbox"
                      .checked="${this.selectedEmployees.includes(emp.id)}"
                      @change="${(e) => this.toggleSelection(e, emp.id)}"
                    />
                  </td>
                  <td>${emp.firstName}</td>
                  <td>${emp.lastName}</td>
                  <td class="light">${formatDate(emp.dateOfBirth)}</td>
                  <td class="light">${formatDate(emp.dateOfEmployment)}</td>
                  <td class="light">${emp.phone}</td>
                  <td class="light">${emp.email}</td>
                  <td class="light">${emp.department}</td>
                  <td class="light">${emp.position}</td>
                  <td>
                    <div class="actions-cell">
                      <button
                        class="table-action-button"
                        @click="${() => Router.go(`/edit-employee/${emp.id}`)}"
                      >
                        <img
                          src="/src/assets/icons/edit.svg"
                          alt="Edit"
                          height="20"
                          width="20"
                        />
                      </button>
                      <button
                        class="table-action-button"
                        @click="${() => this.openModal(emp)}"
                      >
                        <img
                          src="/src/assets/icons/delete.svg"
                          alt="Delete"
                          height="20"
                          width="20"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              `
            )}
          </tbody>
        </table>
      </div>
    `;
  }

  renderList() {
    return html`
      <ul class="card-list">
        ${this.paginatedEmployees.map(
          (emp) => html`
            <li class="card">
              <strong>${emp.firstName} ${emp.lastName}</strong>
              <div class="flex-card-content">
                <img
                  src="/src/assets/icons/email.svg"
                  alt="Email"
                  height="20"
                  width="20"
                />
                <span>${emp.email}</span>
              </div>
              <div class="flex-card-content">
                <img
                  src="/src/assets/icons/phone.svg"
                  alt="Phone"
                  height="20"
                  width="20"
                />
                <span>${emp.phone}</span>
              </div>
              <div class="flex-card-content-between">
                <strong>${msg('Date of Birth')}:</strong>
                <span>${formatDate(emp.dateOfBirth)}</span>
              </div>
              <div class="flex-card-content-between">
                <strong>${msg('Date of Employment')}:</strong>
                <span>${formatDate(emp.dateOfEmployment)}</span>
              </div>
              <div class="flex-card-content-between">
                <strong>${msg('Department')}:</strong>
                <span>${emp.department}</span>
              </div>
              <div class="flex-card-content-between">
                <strong>${msg('Position')}:</strong>
                <span>${emp.position}</span>
              </div>
              <div class="flex-row">
                <button
                  class="table-action-button"
                  @click="${() => Router.go(`/edit-employee/${emp.id}`)}"
                >
                  <img
                    src="/src/assets/icons/edit.svg"
                    alt="Edit"
                    height="20"
                    width="20"
                  />
                </button>
                <button
                  class="table-action-button"
                  @click="${() => this.openModal(emp)}"
                >
                  <img
                    src="/src/assets/icons/delete.svg"
                    alt="Delete"
                    height="20"
                    width="20"
                  />
                </button>
              </div>
            </li>
          `
        )}
      </ul>
    `;
  }

  renderPagination() {
    const totalItems = this.filteredEmployees.length;
    const totalPages = Math.ceil(totalItems / this.employeesPerPage);
    const maxPageButtons = 5;

    const pages = this.getPageNumbers(
      this.currentPage,
      totalPages,
      maxPageButtons
    );

    return html`
      <div class="pagination-container">
        <div class="total-records">
          ${msg('Total Records')}: <strong>${totalItems}</strong>
        </div>
        <div class="pagination">
          <button
            class="page-button"
            ?disabled="${this.currentPage === 1}"
            @click="${() => (this.currentPage = 1)}"
          >
            <img
              src="/src/assets/icons/double-left.svg"
              alt="First Page"
              height="24"
              width="24"
            />
          </button>

          <button
            class="page-button"
            ?disabled="${this.currentPage === 1}"
            @click="${() =>
              (this.currentPage = Math.max(1, this.currentPage - 1))}"
          >
            <img
              src="/src/assets/icons/left.svg"
              alt="Prev"
              height="24"
              width="24"
            />
          </button>

          ${pages.map((page) =>
            page === '...'
              ? html`<span class="page-ellipsis">...</span>`
              : html`
                  <button
                    class="page-number ${this.currentPage === page
                      ? 'active'
                      : ''}"
                    @click="${() => (this.currentPage = page)}"
                  >
                    ${page}
                  </button>
                `
          )}

          <button
            class="page-button"
            ?disabled="${this.currentPage === totalPages}"
            @click="${() =>
              (this.currentPage = Math.min(totalPages, this.currentPage + 1))}"
          >
            <img
              src="/src/assets/icons/right.svg"
              alt="Next"
              height="24"
              width="24"
            />
          </button>

          <button
            class="page-button"
            ?disabled="${this.currentPage === totalPages}"
            @click="${() => (this.currentPage = totalPages)}"
          >
            <img
              src="/src/assets/icons/double-right.svg"
              alt="Last Page"
              height="24"
              width="24"
            />
          </button>
        </div>
        <div class="per-page-selector">
          <label for="per-page"
            >${msg(
              str`${this.viewType === 'table' ? 'Rows' : 'Cards'} per page`
            )}:</label
          >
          <select id="per-page" @change="${this.handlePerPageChange}">
            ${this.rowsPerPage.map(
              (size) => html`
                <option
                  value="${size}"
                  ?selected="${this.employeesPerPage === size}"
                >
                  ${size}
                </option>
              `
            )}
          </select>
        </div>
      </div>
    `;
  }
}

customElements.define('employee-list', localized()(EmployeeList));
