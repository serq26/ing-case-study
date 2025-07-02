import { localized, msg } from '@lit/localize';
import { LitElement, html, css } from 'lit';
import sharedStyles from '../styles/shared-style';

class NavigationMenu extends LitElement {
  static get styles() {
    return [
      sharedStyles,
      css`
        nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 20px;
          background: #fff;
        }
        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }
        .logo span {
          font-weight: bold;
          font-size: 16px;
        }
        .menu {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
        }
        .menu a {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.3rem;
          font-size: 16px;
          text-decoration: none;
        }
        @media (max-width: 768px) {
          .menu a span {
            display: none;
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <nav>
        <div class="logo">
          <img
            src="/src/assets/icons/ing-logo.svg"
            alt="ING"
            width="32"
            height="32"
          />
          <span>ING</span>
        </div>
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
