import { localized, msg } from '@lit/localize';
import { LitElement, css, html } from 'lit';

class NotFoundPage extends LitElement {
  static styles =
    css`
      :host {
        display: flex;
        padding: 200px 16px;
        align-items: center;
        justify-content: center;
      }
    `
  ;

  render() {
    return html`
      <div class="not-found">
        <h2>⛔ ${msg('Page Not Found')} ⛔</h2>
      </div>
    `;
  }
}

customElements.define('not-found-page', localized()(NotFoundPage));
