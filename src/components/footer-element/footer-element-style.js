import { css } from 'lit';

export const footerStyles = css`
  :host {
    display: block;
    background-color: #f5f5f5;
    padding: 1rem;
    text-align: center;
    color: #555;
    font-size: 0.9rem;
    border-top: 1px solid #ddd;
  }

  .footer-content {
    max-width: 960px;
    margin: 0 auto;
  }

  p {
    font-weight: bold;
  }
`;
