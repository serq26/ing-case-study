import { LitElement, html, css } from 'lit';
import { updateWhenLocaleChanges, msg } from '@lit/localize';
import sharedStyles from '../styles/shared-style';
import '../components/employee-form';
import store from '../store/employee-store';

class EmployeeEditView extends LitElement {
  static properties = {
    employee: { type: Object },
  };

  static get styles() {
    return [
      sharedStyles,
      css`
        :host {
          display: block;
          padding: 16px;
        }
        h2 {
          font-weight: 600;
          color: var(--ing-primary);
          font-size: 32px;
        }
      `,
    ];
  }

  constructor() {
    super();
    updateWhenLocaleChanges(this);
    this.employee = null;
  }

  firstUpdated() {
    const id = parseInt(this.location.params.id);
    this.employee = store.getState().employees.find((emp) => emp.id === id);
  }

  render() {
    if (!this.employee) {
      return html`<p>Kayıt bulunamadı.</p>`;
    }
    const fullName = this.employee.firstName + ' ' + this.employee.lastName;

    return html`
      <div class="container-md">
        <div>
          <h2>
            ${msg(
              html`Edit Employee: <span style="color:black">${fullName}</span>`
            )}
          </h2>
        </div>
        <employee-form .employee="${this.employee}"></employee-form>
      </div>
    `;
  }
}

customElements.define('employee-edit-view', EmployeeEditView);
