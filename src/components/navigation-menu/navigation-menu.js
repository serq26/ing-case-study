import { LitElement, html } from 'lit';
import { localized, msg } from '@lit/localize';
import sharedStyles from '../../styles/shared-style';
import { navigationMenuStyles } from './navigation-menu-style';

class NavigationMenu extends LitElement {
  static get styles() {
    return [
      sharedStyles,
      navigationMenuStyles,
    ];
  }

  render() {
    return html`
      <nav>
        <a href="/" style="color:black">
          <div class="logo">
            <img
              src="/src/assets/icons/ing-logo.svg"
              alt="ING"
              width="32"
              height="32"
            />
            <span>ING</span>
          </div>
        </a>

        <div class="menu">
          <a href="/employees">
            <img
              src="/src/assets/icons/employees.svg"
              alt="Employees"
              width="24"
              height="24"
            />
            <span>${msg('Employees')}</span>
          </a>
          <a href="/add-employee">
            <img
              src="/src/assets/icons/plus.svg"
              alt="Add New"
              width="24"
              height="24"
            />
            <span>${msg('Add New')}</span>
          </a>
          <language-picker></language-picker>
        </div>
      </nav>
    `;
  }
}

customElements.define('navigation-menu', localized()(NavigationMenu));
