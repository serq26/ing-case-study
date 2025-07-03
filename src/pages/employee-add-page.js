import { LitElement, html, css } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import '../components/employee-form';
import sharedStyles from '../styles/shared-style';

class EmployeeAddPage extends LitElement {
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
  }

  render() {
    return html`
      <div class="container-md">
        <div>
          <h2>${msg('Add New Employee')}</h2>
        </div>
        <employee-form></employee-form>
      </div>
    `;
  }
}

customElements.define('employee-add-page', EmployeeAddPage);
