import { expect, fixture, html } from '@open-wc/testing';
import './navigation-menu';

suite('Navigation Menu', () => {
  test('renders the navigation menu', async() => {
    const el = await fixture(html`<navigation-menu></navigation-menu>`);
    const nav = el.shadowRoot.querySelector('nav');
    expect(nav).to.exist;
  });

  test('contains the employees link with correct href', async() => {
    const el = await fixture(html`<navigation-menu></navigation-menu>`);
    const employeesLink = el.shadowRoot.querySelector('[data-test-id="employees-link"]');
    expect(employeesLink).to.exist;
    expect(employeesLink.getAttribute('href')).to.equal('/employees');
  });

  test('contains the add-new link with correct href', async() => {
    const el = await fixture(html`<navigation-menu></navigation-menu>`);
    const addNewLink = el.shadowRoot.querySelector('[data-test-id="add-new-link"]');
    expect(addNewLink).to.exist;
    expect(addNewLink.getAttribute('href')).to.equal('/add-employee');
  });

  test('renders the logo with correct image src', async() => {
    const el = await fixture(html`<navigation-menu></navigation-menu>`);
    const logoImg = el.shadowRoot.querySelector('.logo img');
    expect(logoImg).to.exist;
    expect(logoImg.getAttribute('src')).to.equal('/src/assets/icons/ing-logo.svg');
  });
});
