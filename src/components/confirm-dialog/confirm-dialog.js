import { LitElement, html } from 'lit';
import { msg, updateWhenLocaleChanges } from '@lit/localize';
import sharedStyles from '../../styles/shared-style';
import { confirmDialogStyles } from './confirm-dialog-style';

class ConfirmDialog extends LitElement {
  static get styles() {
    return [sharedStyles, confirmDialogStyles];
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
      <div data-test-id="modal" class="modal" style="display: ${this.isOpen ? 'block' : 'none'};">
        <div class="modal-content">
          <span data-test-id="close-icon" class="close" @click=${this.closeModal}>&times;</span>
          <h2>${msg('Are you sure?')}</h2>
          <p>
            <slot></slot>
          </p>
          <button data-test-id="proceed-button" type="submit" @click=${this.confirm} tabindex="1">
            ${msg('Proceed')}
          </button>
          <button data-test-id="cancel-button" class="cancel" @click=${this.closeModal} tabindex="2">
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
