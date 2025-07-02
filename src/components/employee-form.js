import { LitElement, html, css } from 'lit';
import { employeeStore } from '../store/employee-store.js';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import sharedStyles from '../styles/shared-style';
import { Router } from '@vaadin/router';
import {
  isNullOrEmpty,
  isValidBirthDate,
  isValidDateOfEmployment,
  isValidEmail,
  isValidName,
  isValidPhone,
} from '../lib/validation.js';
import { formatPhone } from '../lib/utils.js';

class EmployeeForm extends LitElement {
  static properties = {
    employee: { type: Object },
    errors: { type: Object },
  };

  constructor() {
    super();
    updateWhenLocaleChanges(this);
    this.employee = {
      firstName: '',
      lastName: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      phone: '',
      email: '',
      department: '',
      position: '',
    };
    this.errors = {};
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

        .error {
          color: red;
          padding: 8px 0;
          font-size: 12px;
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

  validateField(name, value) {
    switch (name) {
      case 'firstName':
        return isValidName(value, msg("First Name"));
      case 'lastName':
        return isValidName(value, msg("Last Name"));
      case 'email':
        return isValidEmail(value);
      case 'phone':
        return isValidPhone(value);
      case 'dateOfBirth':
        return isValidBirthDate(value);
      case 'dateOfEmployment':
        return isValidDateOfEmployment(value);
      case 'department':
        return !isNullOrEmpty(value)
          ? { isValid: true, errorMessage: null }
          : { isValid: false, errorMessage: 'Department is required' };
      case 'position':
        return !isNullOrEmpty(value)
          ? { isValid: true, errorMessage: null }
          : { isValid: false, errorMessage: 'Position is required' };
      default:
        return { isValid: true, errorMessage: null };
    }
  }

  handleInputChange(e) {
    const { name, value } = e.target;
    this.employee = { ...this.employee, [name]: value };

    const validation = this.validateField(name, value);
    const newErrors = { ...this.errors };
    if (!validation.isValid) {
      newErrors[name] = validation.errorMessage;
    } else {
      delete newErrors[name];
    }
    this.errors = newErrors;
  }

  handleInputBlur(e) {
    this.handleInputChange(e);
  }

  validateForm() {
    const errors = {};
    for (const [key, value] of Object.entries(this.employee)) {
      const validation = this.validateField(key, value);
      if (!validation.isValid) {
        errors[key] = validation.errorMessage;
      }
    }
    this.errors = errors;
    return Object.keys(errors).length === 0;
  }

  handleSubmit(e) {
    e.preventDefault();

    if (!this.validateForm()) return;

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    if (this.employee.id) {
      data.id = this.employee.id;
      if (confirm('Kaydı güncellemek istediğinize emin misiniz?')) {
        employeeStore.update(data);
      }
    } else {
      data.id = Date.now();
      employeeStore.add(data);
      Router.go('/employees');
    }
  }

  handlePhoneKeyup(e) {
    const input = e.target;
    const formatted = formatPhone(input.value);

    if (formatted !== input.value) {
      input.value = formatted;
      input.setSelectionRange(formatted.length, formatted.length);
    }

    this.employee = { ...this.employee, phone: input.value };

    if (/^\(\d{3}\) \d{3} \d{2} \d{2}$/.test(formatted)) {
      const newErrors = { ...this.errors };
      delete newErrors.phone;
      this.errors = newErrors;
    } else {
      this.errors = { ...this.errors, phone: 'Invalid phone number2' };
    }
  }

  render() {
    const emp = this.employee || {};

    return html`
      <form @submit="${this.handleSubmit}" novalidate>
        <label>
          ${msg('First Name')}
          <input
            name="firstName"
            type="text"
            .value="${emp.firstName || ''}"
            @input="${this.handleInputChange}"
            @blur="${this.handleInputBlur}"
          />
          ${this.errors.firstName &&
          html`<div class="error">${this.errors.firstName}</div>`}
        </label>
        <label>
          ${msg('Last Name')}
          <input
            name="lastName"
            type="text"
            .value="${emp.lastName || ''}"
            @input="${this.handleInputChange}"
            @blur="${this.handleInputBlur}"
          />
          ${this.errors.lastName &&
          html`<div class="error">${this.errors.lastName}</div>`}
        </label>
        <label>
          ${msg('Date of Birth')}
          <input
            name="dateOfBirth"
            type="date"
            .value="${emp.dateOfBirth || ''}"
            @input="${this.handleInputChange}"
            @blur="${this.handleInputBlur}"
            min="1900-01-01"
            max=${new Date().toISOString().split('T')[0]}
          />
          ${this.errors.dateOfBirth &&
          html`<div class="error">${this.errors.dateOfBirth}</div>`}
        </label>
        <label>
          ${msg('Date of Employment')}
          <input
            name="dateOfEmployment"
            type="date"
            .value="${emp.dateOfEmployment || ''}"
            @input="${this.handleInputChange}"
            @blur="${this.handleInputBlur}"
            min="1900-01-01"
            max=${new Date().toISOString().split('T')[0]}
          />
          ${this.errors.dateOfEmployment &&
          html`<div class="error">${this.errors.dateOfEmployment}</div>`}
        </label>
        <label>
          ${msg('Phone')}
          <input
            name="phone"
            type="tel"
            placeholder="(5xx) xxx xx xx"
            .value="${emp.phone || ''}"
            @input="${this.handleInputChange}"
            @blur="${this.handleInputBlur}"
            @keyup="${this.handlePhoneKeyup}"
          />
          ${this.errors.phone &&
          html`<div class="error">${this.errors.phone}</div>`}
        </label>
        <label>
          ${msg('Email')}
          <input
            name="email"
            type="email"
            .value="${emp.email || ''}"
            @input="${this.handleInputChange}"
            @blur="${this.handleInputBlur}"
          />
          ${this.errors.email &&
          html`<div class="error">${this.errors.email}</div>`}
        </label>
        <label>
          ${msg('Department')}
          <select
            name="department"
            @input="${this.handleInputChange}"
            @blur="${this.handleInputBlur}"
          >
            <option value="" ?selected="${!emp.department}">
              Select Department
            </option>
            <option
              value="Analytics"
              ?selected="${emp.department === 'Analytics'}"
            >
            Analytics
            </option>
            <option value="Tech" ?selected="${emp.department === 'Tech'}">
            Tech
            </option>
          </select>
          ${this.errors.department &&
          html`<div class="error">${this.errors.department}</div>`}
        </label>
        <label>
          ${msg('Position')}
          <select
            name="position"
            @input="${this.handleInputChange}"
            @blur="${this.handleInputBlur}"
          >
            <option value="" ?selected="${!emp.position}">
              Select Position
            </option>
            <option value="Junior" ?selected="${emp.position === 'Junior'}">
            Junior
            </option>
            <option value="Medior" ?selected="${emp.position === 'Medior'}">
            Medior
            </option>
            <option value="Senior" ?selected="${emp.position === 'Senior'}">
            Senior
            </option>
          </select>
          ${this.errors.position &&
          html`<div class="error">${this.errors.position}</div>`}
        </label>
        <button type="submit">${msg('Save')}</button>
      </form>
      <button
        type="button"
        title="Turn Back"
        class="turnBack-btn"
        @click=${() => Router.go('/employees')}
      >
        ${msg('Cancel')}
      </button>
    `;
  }
}

customElements.define('employee-form', EmployeeForm);
