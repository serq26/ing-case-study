import { LitElement, html } from 'lit';
import { employeeStore } from '../store/employee-store';
import '../components/employee-form';

class EmployeeEditView extends LitElement {  
  static properties = {
    employee: { type: Object },
  };

  constructor() {
    super();
    this.employee = null;
  }

  firstUpdated() {
    const id = parseInt(this.location.params.id);
    this.employee = employeeStore.employees.find(emp => emp.id === id);
  }

  render() {
    if (!this.employee) {
      return html`<p>Kayıt bulunamadı.</p>`;
    }

    return html`
      <employee-form .employee="${this.employee}"></employee-form>
    `;
  }
}

customElements.define('employee-edit-view', EmployeeEditView);
