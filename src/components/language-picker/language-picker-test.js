import { expect, fixture, html } from '@open-wc/testing';
import './language-picker';
import '../navigation-menu/navigation-menu';

suite('Language Picker', () => {
  test('renders the language dropdown', async() => {
    const el = await fixture(html`<language-picker></language-picker>`);
    const dropdown = el.shadowRoot.querySelector('.lang-dropdown');
    expect(dropdown).to.exist;
  });

  test('has English and Turkish buttons', async() => {
    const el = await fixture(html`<language-picker></language-picker>`);
    const enButton = el.shadowRoot.querySelector('[data-test-id="en-button"]');
    const trButton = el.shadowRoot.querySelector('[data-test-id="tr-button"]');

    expect(enButton).to.exist;
    expect(trButton).to.exist;
  });

  test('changes language icon when language button is clicked', async() => {
    const el = await fixture(html`<navigation-menu></navigation-menu>`);

    const employeesLink = el.shadowRoot.querySelector('[data-test-id="employees-link"] span');
    expect(employeesLink.textContent).to.equal('Employees');

    const langPicker = el.shadowRoot.querySelector('language-picker');
    const trButton = langPicker.shadowRoot.querySelector('[data-test-id="tr-button"]');

    trButton.click();
    await el.updateComplete;
    await langPicker.updateComplete;
    expect(employeesLink.textContent).to.equal('Çalışanlar');

    const enButton = langPicker.shadowRoot.querySelector('[data-test-id="en-button"]');
    enButton.click();
    await el.updateComplete;
    await langPicker.updateComplete;
    expect(employeesLink.textContent).to.equal('Employees');
  });
});
