import { html, fixture, expect, aTimeout } from '@open-wc/testing';
import './employee-form';
import store from '../../store/employee-store';
import { Router } from '@vaadin/router';

suite('EmployeeForm', () => {
  let el;
  setup(async() => {
    el = await fixture(html`<employee-form></employee-form>`);
  });

  test('should show error if all inputs are empty', async() => {
    const submitButton = el.shadowRoot.querySelector(
      '[data-test-id="form-submit-button"]'
    );
    submitButton.click();
    await el.updateComplete;

    const expectedErrors = {
      'firstName-error': 'First Name is required',
      'lastName-error': 'Last Name is required',
      'dateOfBirth-error': 'Date of Birth is required',
      'dateOfEmployment-error': 'Date of Employment is required',
      'phone-error': 'Phone is required',
      'email-error': 'Email is required',
      'department-error': 'Department is required',
      'position-error': 'Position is required',
    };

    for (const [testId, message] of Object.entries(expectedErrors)) {
      const elError = el.shadowRoot.querySelector(`[data-test-id="${testId}"]`);
      expect(elError, `${testId} should exist`).to.exist;
      expect(elError.textContent.trim()).to.equal(message);
    }
  });

  test('should show invalid character error if first name entered invalid character', async() => {
    const input = el.shadowRoot.querySelector('input[name="firstName"]');
    input.value = 'Test+';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('blur', { bubbles: true }));

    await el.updateComplete;

    const firstNameError = el.shadowRoot.querySelector('[data-test-id="firstName-error"]');
    expect(firstNameError).to.exist;
    expect(firstNameError.textContent).to.equal("Only alphabetic characters, space, ' and - are allowed");
  });

  test('should show error if date of birth selected under 18 age', async() => {
    const input = el.shadowRoot.querySelector('input[name="dateOfBirth"]');
    input.value = '2020-12-20';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('blur', { bubbles: true }));

    await el.updateComplete;

    const dateOfBirthError = el.shadowRoot.querySelector('[data-test-id="dateOfBirth-error"]');
    expect(dateOfBirthError).to.exist;
    expect(dateOfBirthError.textContent).to.equal("Must be at least 18 years old");
  });

   test('should show error if date of employment selected future date', async() => {
    const input = el.shadowRoot.querySelector('input[name="dateOfEmployment"]');
    input.value = '2027-12-20';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('blur', { bubbles: true }));

    await el.updateComplete;

    const dateOfEmploymentError = el.shadowRoot.querySelector('[data-test-id="dateOfEmployment-error"]');
    expect(dateOfEmploymentError).to.exist;
    expect(dateOfEmploymentError.textContent).to.equal("Date of Employment cannot be in the future");
  });

  test('should show error for invalid email', async() => {
    const input = el.shadowRoot.querySelector('input[name="email"]');
    input.value = 'invalid-email';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('blur', { bubbles: true }));

    await el.updateComplete;

    const emailError = el.shadowRoot.querySelector('[data-test-id="email-error"]');
    expect(emailError).to.exist;
    expect(emailError.textContent).to.equal("Invalid email address");
  });

  test('should show error for invalid phone number', async() => {
    const input = el.shadowRoot.querySelector('input[name="phone"]');
    input.value = '12345';
    input.dispatchEvent(new Event('keyup', { bubbles: true }));

    await el.updateComplete;

    const phoneError = el.shadowRoot.querySelector('[data-test-id="phone-error"]');
    expect(phoneError).to.exist;
    expect(phoneError.textContent).to.equal("Invalid phone number");
  });

  test('should pass validation when all fields are valid', async() => {
    el.employee = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '(555) 123 45 67',
      dateOfBirth: '1990-01-01',
      dateOfEmployment: '2020-01-01',
      department: 'Tech',
      position: 'Senior',
    };

    const isValid = el.validateForm();
    expect(isValid).to.be.true;
    expect(el.errors).to.deep.equal({});
  });

  test('should show success notify when all fields are valid', async() => {
    el.employee = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '(555) 123 45 67',
      dateOfBirth: '1990-01-01',
      dateOfEmployment: '2020-01-01',
      department: 'Tech',
      position: 'Senior',
    };

    const submitButton = el.shadowRoot.querySelector(
      '[data-test-id="form-submit-button"]'
    );
    submitButton.click();
    await el.updateComplete;
    await aTimeout(2000);
    
    const notify = document.querySelector('.notyf-announcer');
    expect(notify).to.exist;
    expect(notify.textContent.trim()).to.include('Employee added successfully!');
  });

  test('should show error notify if email or phone already exists in store', async() => {
    const originalGetState = store.getState;
    store.getState = () => ({
      employees: [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '(555) 123 45 67',
          dateOfBirth: '1990-01-01',
          dateOfEmployment: '2020-01-01',
          department: 'Tech',
          position: 'Senior',
        },
        {
          id: 2,
          firstName: 'Olivia',
          lastName: 'Robert',
          email: 'same@mail.com',
          phone: '(555) 987 65 43',
          dateOfBirth: '1990-01-01',
          dateOfEmployment: '2020-01-01',
          department: 'Tech',
          position: 'Medior',
        },
      ],
    });

    el.employee = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'same@mail.com',
      phone: '(555) 000 00 00',
      dateOfBirth: '1990-01-01',
      dateOfEmployment: '2020-01-01',
      department: 'Tech',
      position: 'Senior',
    };

    const submitButton = el.shadowRoot.querySelector('[data-test-id="form-submit-button"]');
    submitButton.click();
    await el.updateComplete;
    await aTimeout(2000);

    let notify = document.querySelector('.notyf-announcer');
    expect(notify).to.exist;
    expect(notify.textContent.trim()).to.include(
      'Please enter another email address. Another user is registered with this email address.'
    );

    el.employee.phone = '(555) 123 45 67';
    el.employee.email = 'new@example.com';

    submitButton.click();
    await el.updateComplete;
    await aTimeout(2000);

    notify = document.querySelector('.notyf-announcer');
    expect(notify).to.exist;
    expect(notify.textContent).to.include(
      'Please enter another phone number. Another user is registered with this phone number.'
    );

    store.getState = originalGetState;
  });

  test('should redirect to employees page when added employee successfully', async() => {
    const originalGo = Router.go;

    let navigatedTo = null;
    Router.go = (path) => {
      navigatedTo = path;
    };

    el.employee = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '(555) 123 45 67',
      dateOfBirth: '1990-01-01',
      dateOfEmployment: '2020-01-01',
      department: 'Tech',
      position: 'Senior',
    };

    const submitButton = el.shadowRoot.querySelector(
      '[data-test-id="form-submit-button"]'
    );
    submitButton.click();
    await el.updateComplete;
    await aTimeout(2000);
    
    expect(navigatedTo).to.equal('/employees');
    Router.go = originalGo;
  });
});
