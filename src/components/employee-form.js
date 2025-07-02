import { LitElement, html, css } from 'lit';
import { employeeStore } from '../store/employee-store.js';
import { updateWhenLocaleChanges, msg } from '@lit/localize';
import sharedStyles from '../styles/shared-style';
import { Router } from '@vaadin/router';

class EmployeeForm extends LitElement {
  static properties = {
    employee: { type: Object },
  };

  constructor() {
    super();
    updateWhenLocaleChanges(this);
    this.employee = null;
  }

  static get styles() {
    return [
      sharedStyles,
      css`
        :host {
          background-color: white;
          border-radius: 8px;
        }
        form {
          max-width: 768px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          margin: 0 auto;
          padding: 48px 48px 10px 48px;
        }
        @media (min-width: 768px) {
          form {
            grid-template-columns: 1fr 1fr;
          }
        }
        form label {
          display: block;
          color: var(--ing-primary);
          font-weight: 500;
        }
        form input,
        form select {
          padding: 8px;
          margin-top: 4px;
        }
        form button {
          padding: 8px;
          font-weight: bold;
        }
        @media (min-width: 768px) {
          form button {
            grid-column: span 2;
          }
        }

        form input,
        form select {
          font-weight: 600;
          width: 100%;
          padding: 16px;
          background-color: #f7f7f7;
          border: 2px solid #eee;
          box-sizing: border-box;
          border-radius: 8px;
          transition: all 0.3s ease-in-out;
          &:focus {
            border-color: var(--ing-primary);
          }
        }
        form button {
          background-color: var(--ing-primary);
          color: #ffffff;
          transition: all 0.3s ease-in-out;
          border-radius: 10px;
          width: 50%;
          margin: 0 auto;
          padding: 12px;
          &:hover {
            background-color: var(--ing-secondary);
          }
        }
        @media (max-width: 768px) {
          form button {
            width: 100%;
          }
        }
        .turnBack-btn {
          margin: 10px auto;
          display: block;
          width: 30%;
          padding: 10px;
          border-radius: 10px;
          font-weight: bold;
        }
      `,
    ];
  }

  handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Basic validation
    if (!data.firstName || !data.lastName || !data.email) {
      alert('Ad, Soyad ve Email zorunlu alanlardır.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(data.email)) {
      alert('Geçerli bir email giriniz.');
      return;
    }

    if (this.employee) {
      // Düzenleme modu
      data.id = this.employee.id;
      if (confirm('Kaydı güncellemek istediğinize emin misiniz?')) {
        employeeStore.update(data);
      }
    } else {
      // Ekleme modu
      data.id = Date.now();
      employeeStore.add(data);
    }

    location.href = '/';
  }

  render() {
    const emp = this.employee || {};

    return html`
      <form @submit="${this.handleSubmit}">
        <label>
          ${msg('First Name')}
          <input
            name="firstName"
            type="text"
            .value="${emp.firstName || ''}"
            required
          />
        </label>
        <label>
          ${msg('Last Name')}
          <input
            name="lastName"
            type="text"
            .value="${emp.lastName || ''}"
            required
          />
        </label>
        <label>
          ${msg('Date of Birth')}
          <input
            name="dateOfBirth"
            type="date"
            .value="${emp.dateOfBirth || ''}"
          />
        </label>
        <label>
          ${msg('Date of Employment')}
          <input
            name="dateOfEmployment"
            type="date"
            .value="${emp.dateOfEmployment || ''}"
          />
        </label>
        <label>
          ${msg('Phone')}
          <input
            name="phone"
            type="tel"
            placeholder="(5xx) xxx xx xx"
            .value="${emp.phone || ''}"
          />
        </label>
        <label>
          ${msg('Email')}
          <input
            name="email"
            type="email"
            .value="${emp.email || ''}"
            required
          />
        </label>
        <label>
          ${msg('Department')}
          <select name="department">
            <option
              value="Analytics"
              ?selected="${emp.department === 'Analytics'}"
            >
              ${msg('Analytics')}
            </option>
            <option value="Tech" ?selected="${emp.department === 'Tech'}">
              ${msg('Tech')}
            </option>
          </select>
        </label>
        <label>
          ${msg('Position')}
          <select name="position">
            <option value="Junior" ?selected="${emp.position === 'Junior'}">
              ${msg('Junior')}
            </option>
            <option value="Medior" ?selected="${emp.position === 'Medior'}">
              ${msg('Medior')}
            </option>
            <option value="Senior" ?selected="${emp.position === 'Senior'}">
              ${msg('Senior')}
            </option>
          </select>
        </label>
        <button type="submit">${msg('Save')}</button>
      </form>

      ${this.employee
        ? html`<button
            type="button"
            title="Turn Back"
            class="turnBack-btn"
            @click=${() => Router.go('/employees')}
          >
            ${msg('Cancel')}
          </button>`
        : ''}
    `;
  }
}

customElements.define('employee-form', EmployeeForm);
