import { msg, str } from '@lit/localize';

export function isNullOrEmpty(value) {
  if (value === undefined) return true;
  if (value === null) return true;
  if (value === '') return true;
  return false;
}

export function isValidName(name, fieldName) {
  let isValid = true;
  let errorMessage = null;

  if (isNullOrEmpty(name)) {
    return { isValid: false, errorMessage: msg(str`${fieldName} is required`) };
  }

  if (name.length < 2 || name.length > 50) {
    isValid = false;
    errorMessage = `${fieldName} must be between 2 and 50 characters`;
    return { isValid, errorMessage };
  }

  const characterControl = /^[A-Za-zÇçĞğİıÖöŞşÜü\s'-]+$/.test(name);
  if (!characterControl) {
    isValid = false;
    errorMessage = "Only alphabetic characters, space, ' and - are allowed";
    return { isValid, errorMessage };
  }

  return { isValid, errorMessage };
}

export function isValidBirthDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const timestamp = date.getTime();
  const minDate = new Date('1900-01-01').getTime();
  const ageDiff = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  const dayDiff = today.getDate() - date.getDate();
  let age = ageDiff;

  if (isNullOrEmpty(dateString)) {
    return { isValid: false, errorMessage: 'Date of Birth is required' };
  }

  if (isNaN(timestamp)) {
    return { isValid: false, errorMessage: 'Invalid date' };
  }

  if (timestamp < minDate) {
    return {
      isValid: false,
      errorMessage: 'Date of Birth must be after 1900',
    };
  }

  if (date > today) {
    return {
      isValid: false,
      errorMessage: 'Date of Birth cannot be in the future',
    };
  }

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  if (age < 18) {
    return { isValid: false, errorMessage: 'Must be at least 18 years old' };
  }

  return { isValid: true, errorMessage: null };
}

export function isValidDateOfEmployment(dateString) {
  const date = new Date(dateString);
  const timestamp = date.getTime();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate = new Date('1900-01-01').getTime();

  if (isNullOrEmpty(dateString)) {
    return { isValid: false, errorMessage: 'Date of Employment is required' };
  }

  if (isNaN(timestamp)) {
    return { isValid: false, errorMessage: 'Invalid date' };
  }

  if (timestamp < minDate) {
    return {
      isValid: false,
      errorMessage: 'Date of Employment must be after 1900',
    };
  }

  if (date > today) {
    return {
      isValid: false,
      errorMessage: 'Date of Employment cannot be in the future',
    };
  }

  return { isValid: true, errorMessage: null };
}

export function isValidPhone(phone) {
  let isValid = true;
  let errorMessage = null;

  if (isNullOrEmpty(phone)) {
    return { isValid: false, errorMessage: 'Phone is required' };
  }

  const phoneControl = /^\(\d{3}\) \d{3} \d{2} \d{2}$/.test(phone);
  if (!phoneControl) {
    isValid = false;
    errorMessage = 'Invalid phone number1';
    return { isValid, errorMessage };
  }

  return { isValid, errorMessage };
}

export function isValidEmail(email) {
  let isValid = true;
  let errorMessage = null;

  if (isNullOrEmpty(email)) {
    return { isValid: false, errorMessage: 'Email is required' };
  }

  const emailControl = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailControl) {
    isValid = false;
    errorMessage = 'Invalid email address';
    return { isValid, errorMessage };
  }

  return { isValid, errorMessage };
}
