import { LitElement, html } from 'lit';
import { localized, msg } from '@lit/localize';
import { footerStyles } from './footer-element-style';

export class FooterElement extends LitElement {
  static styles = footerStyles;

  render() {
    return html`
      <div class="footer-content">
        <p>&copy; ${new Date().getFullYear()} ${msg("All rights reserved.")}</p>
        <p>
          ING Case Study
        </p>
      </div>
    `;
  }
}

customElements.define('footer-element', localized()(FooterElement));
