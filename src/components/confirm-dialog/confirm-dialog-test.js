import { fixture, html, expect, oneEvent } from '@open-wc/testing';
import './confirm-dialog';

suite('Confirm Dialog', () => {
  test('should display when isOpen is true', async() => {
    const el = await fixture(
      html`<confirm-dialog .isOpen=${true}></confirm-dialog>`
    );
    const modal = el.shadowRoot.querySelector('[data-test-id="modal"');
    expect(modal.style.display).to.equal('block');
  });

  test('should fire confirm event with employee data on confirm button click', async() => {
    const employee = { id: 1, firstName: 'Serhat' };
    const el = await fixture(
      html`<confirm-dialog
        .isOpen=${true}
        .employee=${employee}
      ></confirm-dialog>`
    );
    const proceedButton = el.shadowRoot.querySelector('[data-test-id="proceed-button"]');

    setTimeout(() => proceedButton.click());
    const event = await oneEvent(el, 'confirm');

    expect(event).to.exist;
    expect(event.detail).to.deep.equal(employee);
  });

  test('should fire close event and hide modal on cancel button click', async() => {
    const el = await fixture(
      html`<confirm-dialog .isOpen=${true}></confirm-dialog>`
    );
    const cancelButton = el.shadowRoot.querySelector('[data-test-id="cancel-button"]');

    setTimeout(() => cancelButton.click());
    const event = await oneEvent(el, 'close');

    expect(event).to.exist;
    await el.updateComplete;
    const modal = el.shadowRoot.querySelector('[data-test-id="modal"');
    expect(modal.style.display).to.equal('none');
  });

  test('should fire close event and hide modal on close icon click', async() => {
    const el = await fixture(
      html`<confirm-dialog .isOpen=${true}></confirm-dialog>`
    );
    const closeIcon = el.shadowRoot.querySelector('[data-test-id="close-icon"]');

    setTimeout(() => closeIcon.click());
    const event = await oneEvent(el, 'close');

    expect(event).to.exist;
    await el.updateComplete;
    const modal = el.shadowRoot.querySelector('[data-test-id="modal"]');
    expect(modal.style.display).to.equal('none');
  });
});
