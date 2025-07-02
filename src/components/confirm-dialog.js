import { msg, updateWhenLocaleChanges } from '@lit/localize';
import { LitElement, css, html } from 'lit';
import sharedStyles from '../styles/shared-style';

class ConfirmDialog extends LitElement {
  static get styles() {
    return [
      sharedStyles,
      css`
        .modal {
          display: none;
          position: fixed;
          z-index: 1;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          overflow: auto;
          background-color: rgb(0, 0, 0);
          background-color: rgba(0, 0, 0, 0.4);
          padding-top: 60px;
        }
        .modal-content {
          width: 80%;
          max-width: var(--xs-breakpoint);
          margin: 10% auto;
          background-color: #fefefe;
          padding: 20px;
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
            0 6px 20px 0 rgba(0, 0, 0, 0.19);
          border-radius: 8px;
        }
        .modal-content .close {
          color: var(--ing-orange);
          float: right;
          font-size: 40px;
          margin-top: -8px;
        }
        .modal-content .close:hover {
          color: var(--ing-dark-blue);
        }
        .modal-content h2 {
          margin-top: 0;
          font-size: 28px;
          font-weight: normal;
          color: var(--ing-orange);
        }
        .modal-content p {
          margin: 32px 0;
        }
        .modal-content button {
          display: block;
          width: 100%;
          margin-top: 16px;
        }
        .close:hover,
        .close:focus {
          color: black;
          text-decoration: none;
          cursor: pointer;
        }
      `,
    ];
  }

  static get properties() {
    return {
      isOpen: { type: Boolean },
      employee: { type: Object },
    };
  }

  constructor() {
    super();
    updateWhenLocaleChanges(this);
    this.isOpen = false;
    this.employee = null;
  }

  render() {
    return html`
      <div class="modal" style="display: ${this.isOpen ? 'block' : 'none'};">
        <div class="modal-content">
          <span class="close" @click=${this.closeModal}>&times;</span>
          <h2>${msg('Are you sure?')}</h2>
          <p>
            <slot></slot>
          </p>
          <button type="submit" @click=${this.confirm} tabindex="1">
            ${msg('Proceed')}
          </button>
          <button class="cancel" @click=${this.closeModal} tabindex="2">
            ${msg('Cancel')}
          </button>
        </div>
      </div>
    `;
  }

  closeModal() {
    this.isOpen = false;
    this.dispatchEvent(new CustomEvent('close'));
  }

  confirm() {
    this.dispatchEvent(new CustomEvent('confirm', { detail: this.employee }));
    this.closeModal();
  }
}

customElements.define('confirm-dialog', ConfirmDialog);
