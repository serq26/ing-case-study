import { LitElement, html } from 'lit';
import '../components/employee-list';

class EmployeeListView extends LitElement {
  render() {
    return html`
      <employee-list></employee-list>
    `;
  }
}

customElements.define('employee-list-view', EmployeeListView);
