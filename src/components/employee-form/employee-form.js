import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges, str } from '@lit/localize';
import { Router } from '@vaadin/router';
import sharedStyles from '../../styles/shared-style.js';
import {
  isNullOrEmpty,
  isValidBirthDate,
  isValidDateOfEmployment,
  isValidEmail,
  isValidName,
  isValidPhone,
} from '../../lib/validation.js';
import { formatPhone, notyf } from '../../lib/utils.js';
import '../confirm-dialog/confirm-dialog.js';
import store, {
  addEmployee,
  updateEmployee,
} from '../../store/employee-store.js';
import { employeeFormStyles } from './employee-form-style.js';

class EmployeeForm extends LitElement {
  static properties = {
    employee: { type: Object },
    errors: { type: Object },
    pendingFormData: { type: Object },
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
    this.pendingFormData = null;
  }

  static get styles() {
    return [sharedStyles, employeeFormStyles];
  }

  validateField(name, value) {
    switch (name) {
      case 'firstName':
        return isValidName(value, msg('First Name'));
      case 'lastName':
        return isValidName(value, msg('Last Name'));
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
          : { isValid: false, errorMessage: msg('Department is required') };
      case 'position':
        return !isNullOrEmpty(value)
          ? { isValid: true, errorMessage: null }
          : { isValid: false, errorMessage: msg('Position is required') };
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

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('confirm', () => this.handleConfirm());
  }

  emailAndPhoneControl(email, phone, controlType, currentId = null) {
    const employees = store.getState().employees;

    const isEmailTaken = employees.some((item) => {
      if (controlType === 'edit' && item.id === currentId) return false;
      return item.email === email;
    });

    if (isEmailTaken) {
      notyf.error(
        msg(
          'Please enter another email address. Another user is registered with this email address.'
        )
      );
      return false;
    }

    const isPhoneTaken = employees.some((item) => {
      if (controlType === 'edit' && item.id === currentId) return false;
      return item.phone === phone;
    });

    if (isPhoneTaken) {
      notyf.error(
        msg(
          'Please enter another phone number. Another user is registered with this phone number.'
        )
      );
      return false;
    }

    return true;
  }

  handleConfirm() {
    const data = this.pendingFormData;
    data.id = this.employee.id;
    const result = store.dispatch(updateEmployee(data));
    if (result.payload) {
      notyf.success(msg('Employee updated successfully!'));
    } else {
      notyf.error(msg('Failed to update employee.'));
    }
    Router.go('/employees');
  }

  handleSubmit(e) {
    e.preventDefault();

    if (!this.validateForm()) return;

    if (
      !this.emailAndPhoneControl(
        this.employee.email,
        this.employee.phone,
        this.employee.id ? 'edit' : 'add',
        this.employee.id
      )
    )
      return;

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    this.pendingFormData = data;

    if (this.employee.id) {
      this.shadowRoot.querySelector('confirm-dialog').isOpen = true;
    } else {
      data.id = Date.now();
      const result = store.dispatch(addEmployee(data));
      if (result.payload) {
        notyf.success(msg('Employee added successfully!'));
      } else {
        notyf.error(msg('Failed to add employee.'));
      }
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
      this.errors = { ...this.errors, phone: msg('Invalid phone number') };
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
          html`<div data-test-id="firstName-error" class="error">${this.errors.firstName}</div>`}
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
          html`<div data-test-id="lastName-error" class="error">${this.errors.lastName}</div>`}
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
          html`<div data-test-id="dateOfBirth-error" class="error">${this.errors.dateOfBirth}</div>`}
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
          html`<div data-test-id="dateOfEmployment-error" class="error">${this.errors.dateOfEmployment}</div>`}
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
          html`<div data-test-id="phone-error" class="error">${this.errors.phone}</div>`}
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
          html`<div data-test-id="email-error" class="error">${this.errors.email}</div>`}
        </label>
        <label>
          ${msg('Department')}
          <select
            name="department"
            @input="${this.handleInputChange}"
            @blur="${this.handleInputBlur}"
          >
            <option value="" ?selected="${!emp.department}">
              ${msg("Select Department")}
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
          html`<div data-test-id="department-error" class="error">${this.errors.department}</div>`}
        </label>
        <label>
          ${msg('Position')}
          <select
            name="position"
            @input="${this.handleInputChange}"
            @blur="${this.handleInputBlur}"
          >
            <option value="" ?selected="${!emp.position}">
              ${msg("Select Position")}
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
          html`<div data-test-id="position-error" class="error">${this.errors.position}</div>`}
        </label>
        <button data-test-id="form-submit-button" type="submit">${msg('Save')}</button>
      </form>
      <button
        type="button"
        title="${msg('Turn Back')}"
        class="cancel turn-back"
        @click=${() => Router.go('/employees')}
      >
        ${msg('Cancel')}
      </button>
      <confirm-dialog .employee=${this.employee} @confirm=${this.handleConfirm}>
        ${msg(
          str`Employee record of "${emp.firstName} ${emp.lastName}" will be updated`
        )}
      </confirm-dialog>
    `;
  }
}

customElements.define('employee-form', EmployeeForm);
