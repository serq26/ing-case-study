import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import { employeeStore } from '../store/employee-store.js';
import { localized, msg, str } from '@lit/localize';
import sharedStyles from '../styles/shared-style.js';

class EmployeeList extends LitElement {
  static properties = {
    search: { type: String },
    currentPage: { type: Number },
    viewType: { type: String },
    employeesPerPage: { type: Number },
    selectedEmployees: { type: Array },
    allSelected: { type: Boolean },
  };

  constructor() {
    super();
    this.search = '';
    this.currentPage = 1;
    this.viewType = 'table';
    this.employeesPerPage = 5;
    this.selectedEmployees = [];
    this.allSelected = false;
  }

  static get styles() {
    return [
      sharedStyles,
      css`
        h2 {
          color: var(--ing-primary);
        }
        .actions button {
          margin-right: 5px;
        }
        .table-actions {
          background-color: #ffffff;
          padding: 10px;
          border-radius: 12px 12px 0 0;
        }
        .search-box {
          background-color: #f7f7f7;
          padding: 10px;
          border-radius: 10px;
          border: 2px solid #f7f7f7;
          font-weight: 600;
          &:focus {
            border-color: var(--ing-primary);
          }
        }
        .delete-button {
          background-color: #eb4141;
          color: #ffffff;
          padding: 8px 20px;
          border-radius: 6px;
          margin-left: 6px;
          font-weight: bold;
          transition: all 0.3s ease-in-out;
          &:hover {
            background-color: #ba1818;
          }
        }
        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          margin: 16px 0;
        }

        .page-button,
        .page-number {
          width: 30px;
          height: 30px;
          padding: 4px 8px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .page-button:disabled,
        .page-number:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-number.active {
          background: var(--ing-primary);
          border-color: var(--ing-primary);
          color: #fff;
          border-radius: 50%;
        }

        .page-ellipsis {
          padding: 4px 8px;
          color: #666;
        }

        @media screen and (max-width: 768px) {
          table,
          th,
          td {
            font-size: 12px;
          }
        }
      `,
    ];
  }

  get filteredEmployees() {
    return employeeStore.employees.filter((emp) =>
      `${emp.firstName} ${emp.lastName}`
        .toLowerCase()
        .includes(this.search.toLowerCase())
    );
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
      // Küçük sayfalar için tümünü göster
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

  deleteEmployee(id) {
    if (confirm('silmek istedğine emin misin?')) {
      employeeStore.remove(id);
      this.requestUpdate();
    }
  }

  changeView(type) {
    this.viewType = type;
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

  deleteSelected() {
    if (confirm('Seçilen çalışanları silmek istiyor musunuz?')) {
      this.selectedEmployees.forEach((id) => employeeStore.remove(id));
      this.selectedEmployees = [];
      this.requestUpdate();
    }
  }

  render() {
    return html`
      <div class="container-lg">
        <div>
          <div class="flex-row-between">
            <h2>${msg('Employee List')}</h2>
            <div class="flex-row">
              <div class="actions">
                <button @click="${() => this.changeView('table')}">
                  <img
                    src="/src/assets/icons/table.svg"
                    alt="Table"
                    width="32"
                    height="32"
                  />
                </button>
                <button @click="${() => this.changeView('list')}">
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
          ${this.viewType === 'table' ? this.renderTable() : this.renderList()}
          ${this.renderPagination()}
        </div>
      </div>
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
                  <button class="delete-button" @click="${this.deleteSelected}">
                    ${msg('Delete')}
                  </button>
                </th>
              </tr>`
            : ''}
        </div>
        <input
          class="search-box"
          type="text"
          placeholder="${msg('Search...')}"
          @input="${(e) => (this.search = e.target.value)}"
        />
      </div>
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
            <th>${msg('First Name')}</th>
            <th>${msg('Last Name')}</th>
            <th>${msg('Date of Birth')}</th>
            <th>${msg('Date of Employment')}</th>
            <th>${msg('Phone')}</th>
            <th>${msg('Email')}</th>
            <th>${msg('Department')}</th>
            <th>${msg('Position')}</th>
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
                <td>${emp.dateOfEmployment}</td>
                <td>${emp.dateOfBirth}</td>
                <td>${emp.phone}</td>
                <td>${emp.email}</td>
                <td>${emp.department}</td>
                <td>${emp.position}</td>
                <td>
                  <button
                    @click="${() => Router.go(`/edit-employee/${emp.id}`)}"
                  >
                    Güncelle
                  </button>
                  <button @click="${() => this.deleteEmployee(emp.id)}">
                    Sil
                  </button>
                </td>
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
  }

  renderList() {
    return html`
      <ul>
        ${this.paginatedEmployees.map(
          (emp) => html`
            <li>
              <input
                type="checkbox"
                .checked="${this.selectedEmployees.includes(emp.id)}"
                @change="${(e) => this.toggleSelection(e, emp.id)}"
              />
              <strong>${emp.firstName} ${emp.lastName}</strong> |
              ${emp.department} | ${emp.position}
              <button
                @click="${() => (location.href = `/edit-employee/${emp.id}`)}"
              >
                Güncelle
              </button>
              <button @click="${() => this.deleteEmployee(emp.id)}">Sil</button>
            </li>
          `
        )}
      </ul>
    `;
  }

  // renderPagination() {
  //   const totalPages = Math.ceil(
  //     this.filteredEmployees.length / this.employeesPerPage
  //   );

  //   return html`
  //     <div class="pagination">
  //       <button
  //         class="page-button ${this.currentPage === 1 ? 'page-button-passive' : ''}"
  //         @click="${() => (this.currentPage = this.currentPage - 1)}"
  //       >
  //         <img src="/src/assets/icons/left.svg" alt="Prev" height="24" width="24" />
  //       </button>
  //       ${Array.from(
  //         { length: totalPages },
  //         (_, i) =>
  //           html`
  //             <button
  //               class="page-number ${this.currentPage === i + 1
  //                 ? 'page-number-active'
  //                 : ''}"
  //               ?disabled="${this.currentPage === i + 1}"
  //               @click="${() => (this.currentPage = i + 1)}"
  //             >
  //               ${i + 1}
  //             </button>
  //           `
  //       )}
  //           <button
  //         class="page-button ${this.currentPage === totalPages ? 'page-button-passive' : ''}"
  //         @click="${() => (this.currentPage = this.currentPage + 1)}"
  //       >
  //         <img src="/src/assets/icons/right.svg" alt="Next" height="24" width="24" />
  //       </button>
  //     </div>
  //   `;
  // }

  // renderPagination() {
  //   const totalPages = Math.ceil(
  //     this.filteredEmployees.length / this.employeesPerPage
  //   );

  //   return html`
  //     <div class="pagination-container">
  //       <div class="per-page-selector">
  //         <label for="per-page">Rows per page:</label>
  //         <select id="per-page" @change="${this.handlePerPageChange}">
  //           ${[5, 10, 20, 50, 100].map(
  //             (size) => html`
  //               <option
  //                 value="${size}"
  //                 ?selected="${this.employeesPerPage === size}"
  //               >
  //                 ${size}
  //               </option>
  //             `
  //           )}
  //         </select>
  //       </div>

  //       <div class="pagination">
  //         <button
  //           class="page-button ${this.currentPage === 1
  //             ? 'page-button-passive'
  //             : ''}"
  //           @click="${() =>
  //             (this.currentPage = Math.max(1, this.currentPage - 1))}"
  //         >
  //           <img
  //             src="/src/assets/icons/left.svg"
  //             alt="Prev"
  //             height="24"
  //             width="24"
  //           />
  //         </button>

  //         ${Array.from(
  //           { length: totalPages },
  //           (_, i) =>
  //             html`
  //               <button
  //                 class="page-number ${this.currentPage === i + 1
  //                   ? 'page-number-active'
  //                   : ''}"
  //                 ?disabled="${this.currentPage === i + 1}"
  //                 @click="${() => (this.currentPage = i + 1)}"
  //               >
  //                 ${i + 1}
  //               </button>
  //             `
  //         )}

  //         <button
  //           class="page-button ${this.currentPage === totalPages
  //             ? 'page-button-passive'
  //             : ''}"
  //           @click="${() =>
  //             (this.currentPage = Math.min(totalPages, this.currentPage + 1))}"
  //         >
  //           <img
  //             src="/src/assets/icons/right.svg"
  //             alt="Next"
  //             height="24"
  //             width="24"
  //           />
  //         </button>
  //       </div>
  //     </div>
  //   `;
  // }

  // renderPagination() {
  //   const totalItems = this.filteredEmployees.length;
  //   const totalPages = Math.ceil(totalItems / this.employeesPerPage);
  //   const startItem = (this.currentPage - 1) * this.employeesPerPage + 1;
  //   const endItem = Math.min(startItem + this.employeesPerPage - 1, totalItems);

  //   return html`
  //     <div class="pagination-container">
  //       <div class="per-page-selector">
  //         <label for="per-page">Rows per page:</label>
  //         <select id="per-page" @change="${this.handlePerPageChange}">
  //           ${[5, 10, 20, 50, 100].map(
  //             (size) => html`
  //               <option
  //                 value="${size}"
  //                 ?selected="${this.employeesPerPage === size}"
  //               >
  //                 ${size}
  //               </option>
  //             `
  //           )}
  //         </select>
  //       </div>
  //       <div class="pagination-buttons">
  //         <button
  //           class="page-button"
  //           ?disabled="${this.currentPage === 1}"
  //           @click="${() => (this.currentPage = 1)}"
  //         >
  //           <img
  //             src="/src/assets/icons/double-left.svg"
  //             alt="First Page"
  //             height="24"
  //             width="24"
  //           />
  //         </button>
  //         <button
  //           class="page-button"
  //           ?disabled="${this.currentPage === 1}"
  //           @click="${() =>
  //             (this.currentPage = Math.max(1, this.currentPage - 1))}"
  //         >
  //           <img
  //             src="/src/assets/icons/left.svg"
  //             alt="Prev"
  //             height="24"
  //             width="24"
  //           />
  //         </button>
  //         <div class="pagination-info">
  //           ${totalItems > 0
  //             ? html`${startItem}-${endItem} of ${totalItems} records`
  //             : '0 records'}
  //         </div>
  //         <button
  //           class="page-button"
  //           ?disabled="${this.currentPage === totalPages || totalPages === 0}"
  //           @click="${() =>
  //             (this.currentPage = Math.min(totalPages, this.currentPage + 1))}"
  //         >
  //           <img
  //             src="/src/assets/icons/right.svg"
  //             alt="Next"
  //             height="24"
  //             width="24"
  //           />
  //         </button>
  //         <button
  //           class="page-button"
  //           ?disabled="${this.currentPage === totalPages || totalPages === 0}"
  //           @click="${() => (this.currentPage = totalPages)}"
  //         >
  //           <img
  //             src="/src/assets/icons/double-right.svg"
  //             alt="Last Page"
  //             height="24"
  //             width="24"
  //           />
  //         </button>
  //       </div>
  //     </div>
  //   `;
  // }

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
      <div class="flex-row-between">
        <div style="width: 200px"></div>
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
        <div class="per-page-selector" style="width: 200px">
          <label for="per-page">Rows per page:</label>
          <select id="per-page" @change="${this.handlePerPageChange}">
            ${[5, 10, 20, 50, 100].map(
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
