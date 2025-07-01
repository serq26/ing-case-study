import { LitElement, html, css } from 'lit';

class ConfirmDialog extends LitElement {
  static properties = {
    open: { type: Boolean },
    message: { type: String },
  };

  constructor() {
    super();
    this.open = false;
    this.message = '';
  }

  static styles = css`
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .dialog {
      background: white;
      padding: 1rem;
      border-radius: 6px;
      min-width: 300px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }
    button {
      margin: 0.5rem;
    }
  `;

  render() {
    if (!this.open) return html``;

    return html`
      <div class="backdrop">
        <div class="dialog">
          <p>${this.message}</p>
          <button @click="${() => this._confirm(true)}">Evet</button>
          <button @click="${() => this._confirm(false)}">Hayır</button>
        </div>
      </div>
    `;
  }

  _confirm(result) {
    this.dispatchEvent(new CustomEvent('confirm', { detail: result }));
    this.open = false;
  }
}

customElements.define('confirm-dialog', ConfirmDialog);
