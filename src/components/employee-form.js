import { LitElement, html, css } from 'lit';
import { employeeStore } from '../store/employee-store.js';

class EmployeeForm extends LitElement {
  static properties = {
    employee: { type: Object },
  };

  constructor() {
    super();
    this.employee = null;
  }

  static styles = css`
    form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-width: 400px;
    }
    input, select {
      padding: 6px;
    }
  `;

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
      <h2>${this.employee ? 'Güncelle' : 'Ekle'}</h2>

      <form @submit="${this.handleSubmit}">
        <input
          name="firstName"
          placeholder="Ad"
          .value="${emp.firstName || ''}"
          required
        />
        <input
          name="lastName"
          placeholder="Soyad"
          .value="${emp.lastName || ''}"
          required
        />
        <input
          name="dateOfBirth"
          type="date"
          .value="${emp.dateOfBirth || ''}"
        />
        <input
          name="dateOfEmployment"
          type="date"
          .value="${emp.dateOfEmployment || ''}"
        />
        <input
          name="phone"
          placeholder="Telefon"
          .value="${emp.phone || ''}"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          .value="${emp.email || ''}"
          required
        />
        <select name="department">
          <option value="Analytics" ?selected="${emp.department === 'Analytics'}">Analytics</option>
          <option value="Tech" ?selected="${emp.department === 'Tech'}">Tech</option>
        </select>
        <select name="position">
          <option value="Junior" ?selected="${emp.position === 'Junior'}">Junior</option>
          <option value="Medior" ?selected="${emp.position === 'Medior'}">Medior</option>
          <option value="Senior" ?selected="${emp.position === 'Senior'}">Senior</option>
        </select>

        <button type="submit">
          ${this.employee ? 'Güncelle' : 'Ekle'}
        </button>
      </form>
    `;
  }
}

customElements.define('employee-form', EmployeeForm);
