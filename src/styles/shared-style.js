import { css } from 'lit';

const globalStyles = css`
  :root {
    --ing-primary: #ff6600;
    --ing-secondary: #091c5a;
    --text-primary: #424242;
    --xs-breakpoint: 600px;
    --md-breakpoint: 1024px;
    --lg-breakpoint: 1440px;
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
  }

  table tr {
    border-bottom: 2px solid #eee;
  }

  table th,
  table td {
    padding: 8px;
    border: none;
    text-align: center;
  }

  table th {
    color: var(--ing-primary);
  }

  table td {
    color: var(--text-primary);
  }

  .container {
    display: flex;
    max-width: var(--lg-breakpoint);
    margin: 0 auto;
    justify-content: space-around;
    align-items: center;
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
    justify-content: space-between
  }

  @media screen and (max-width: 768px) {
    table,
    th,
    td {
      font-size: 12px;
    }
  }
`;

const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(globalStyles.cssText);
document.adoptedStyleSheets = [styleSheet];

export default globalStyles;
