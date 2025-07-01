import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import { employeeStore } from '../store/employee-store.js';
import { localized, msg } from '@lit/localize';

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

  static styles = css`
    .actions button {
      margin-right: 5px;
    }
    @media screen and (max-width: 768px) {
      table,
      th,
      td {
        font-size: 12px;
      }
    }
  `;

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

    // tüm satırlar seçili mi kontrol et
    const allIds = this.paginatedEmployees.map((emp) => emp.id);
    this.allSelected = allIds.every((id) =>
      this.selectedEmployees.includes(id)
    );
  }

  toggleSelectAll(e) {
    const checked = e.target.checked;
    this.allSelected = checked;

    if (checked) {
      // sayfadaki tüm çalışanları seç
      this.selectedEmployees = this.paginatedEmployees.map((emp) => emp.id);
    } else {
      // seçimleri temizle
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
      <h2>${msg('Employee List')}</h2>
      <p>${msg('Hello World!')}</p>

      <input
        type="text"
        placeholder="Ara..."
        @input="${(e) => (this.search = e.target.value)}"
      />

      <div class="actions">
        <button @click="${() => this.changeView('table')}">Table</button>
        <button @click="${() => this.changeView('list')}">List</button>
      </div>

      ${this.viewType === 'table' ? this.renderTable() : this.renderList()}
      ${this.renderPagination()}
    `;
  }

  renderTable() {
    return html`
      <table border="1" cellspacing="0" cellpadding="5">
        <thead>
          ${this.selectedEmployees.length > 0
            ? html` <tr>
                <th colspan="6">
                  <button @click="${this.deleteSelected}">
                    Seçilenleri Sil
                  </button>
                </th>
              </tr>`
            : ''}

          <tr>
            <th>
              <input
                type="checkbox"
                .checked="${this.allSelected}"
                @change="${this.toggleSelectAll}"
              />
            </th>
            <th>Ad</th>
            <th>Soyad</th>
            <th>Departman</th>
            <th>Pozisyon</th>
            <th>İşlem</th>
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
              <button @click="${() => this.deleteEmployee(emp.id)}">
                Sil
              </button>
            </li>
          `
        )}
      </ul>
    `;
  }

  renderPagination() {
    const totalPages = Math.ceil(
      this.filteredEmployees.length / this.employeesPerPage
    );

    return html`
      <div style="margin-top:1rem;">
        ${Array.from(
          { length: totalPages },
          (_, i) =>
            html`
              <button
                ?disabled="${this.currentPage === i + 1}"
                @click="${() => (this.currentPage = i + 1)}"
              >
                ${i + 1}
              </button>
            `
        )}
      </div>
    `;
  }
}

customElements.define('employee-list', localized()(EmployeeList));
