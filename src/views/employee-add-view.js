import { LitElement, html } from 'lit';
import '../components/employee-form';

class EmployeeAddView extends LitElement {
  render() {
    return html`
      <employee-form></employee-form>
    `;
  }
}

customElements.define('employee-add-view', EmployeeAddView);
