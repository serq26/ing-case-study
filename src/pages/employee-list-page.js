import { LitElement, html } from 'lit';
import '../components/employee-list/employee-list';

class EmployeeListPage extends LitElement {
  render() {
    return html`
      <employee-list></employee-list>
    `;
  }
}

customElements.define('employee-list-page', EmployeeListPage);
