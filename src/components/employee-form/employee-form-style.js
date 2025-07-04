import { css } from 'lit';

export const employeeFormStyles = css`
  :host {
    background-color: white;
    border-radius: 8px;
  }
  form {
    max-width: 768px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;
    margin: 0 auto;
    padding: 48px 48px 10px 48px;
  }
  @media (min-width: 768px) {
    form {
      grid-template-columns: 1fr 1fr;
    }
  }
  form label {
    display: block;
    color: var(--ing-primary);
    font-weight: 500;
  }
  form input,
  form select {
    padding: 8px;
    margin-top: 4px;
  }
  form button {
    padding: 8px;
    font-weight: bold;
  }
  @media (min-width: 768px) {
    form button {
      grid-column: span 2;
    }
  }

  form input,
  form select {
    font-weight: 600;
    width: 100%;
    padding: 16px;
    background-color: #f7f7f7;
    border: 2px solid #eee;
    box-sizing: border-box;
    border-radius: 8px;
    transition: all 0.3s ease-in-out;
    &:focus {
      border-color: var(--ing-primary);
    }
  }
  form button {
    background-color: var(--ing-primary);
    color: #ffffff;
    transition: all 0.3s ease-in-out;
    border-radius: 10px;
    width: 50%;
    margin: 0 auto;
    padding: 12px;
    &:hover {
      background-color: var(--ing-secondary);
    }
  }
  @media (max-width: 768px) {
    form {
      padding: 16px;
    }
    form button {
      width: 100%;
    }
  }
  .error {
    color: red;
    padding: 8px 0;
    font-size: 12px;
  }
  .turn-back {
    width: 30%;
    display: block;
    margin: 10px auto;
  }
`;
