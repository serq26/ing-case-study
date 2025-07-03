import { css } from 'lit';

const sharedStyles = css`
  :root {
    --ing-primary: #ff6600;
    --ing-secondary: #091c5a;
    --ing-purple: #4b468c;
    --ing-dark-blue: rgb(24, 31, 84);
    --text-primary: #424242;
    --grey-bg: #f7f7f7;
    --xs-breakpoint: 600px;
    --md-breakpoint: 1024px;
    --lg-breakpoint: 1440px;
    --xl-breakpoint: 1560px;
  }

  body {
    font-family: 'Roboto', Arial, sans-serif;
    padding: 0;
    margin: 0;
    background: #eee;
  }

  h2 {
    margin: 1rem 0;
  }

  a {
    text-decoration: none;
    color: var(--ing-primary);
  }

  input,
  select,
  button {
    font-size: 14px;
    padding: 6px;
    border: none;
    outline: none;
    cursor: pointer;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    border-color: #eee;
    background-color: #fff;
    border-radius: 0 0 12px 12px;
  }

  table tr {
    border-bottom: 2px solid #eee;
  }

  table th,
  table td {
    padding: 20px 10px;
    border: none;
    text-align: center;
  }

  table th {
    color: var(--ing-primary);
    cursor: pointer;
  }

  table td {
    color: #000000;
    font-weight: 500;
    max-width: 300px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 15px;
  }

  input[type='checkbox'] {
    width: 20px;
    height: 20px;
  }

  .container-xl {
    display: flex;
    max-width: var(--xl-breakpoint);
    margin: 0 auto;
    justify-content: center;
    flex-direction: column;
  }

  .container-lg {
    display: flex;
    max-width: var(--lg-breakpoint);
    margin: 0 auto;
    justify-content: center;
    flex-direction: column;
  }

  .container-md {
    display: flex;
    max-width: var(--md-breakpoint);
    margin: 0 auto;
    justify-content: center;
    flex-direction: column;
  }

  .flex-row {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 20px;
  }

  .flex-row-between {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  button[type='submit'] {
    min-height: 48px;
    color: white;
    background-color: var(--ing-primary);
    font-size: 16px;
    border-radius: 8px;
    border: 0;
    transition: background-color 0.3s ease;
    &:hover {
      cursor: pointer;
      background-color: var(--ing-secondary);
    }
  }

  button.cancel {
    min-height: 48px;
    font-size: 16px;
    color: var(--ing-purple);
    border: 2px solid var(--ing-purple);
    border-radius: 8px;
    background-color: transparent;
    transition: background-color 0.3s ease;
    &:hover {
      cursor: pointer;
      background-color: var(--grey-bg);
    }
  }

  @media screen and (max-width: 768px) {
    table,
    th,
    td {
      font-size: 12px;
    }
    .container-lg {
      padding: 20px;
    }
  }
`;

const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(sharedStyles.cssText);
document.adoptedStyleSheets = [styleSheet];

export default sharedStyles;
