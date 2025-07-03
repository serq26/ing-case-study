import { css } from 'lit';

export const navigationMenuStyles = css`
  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    background: #fff;
  }
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }
  .logo span {
    font-weight: bold;
    font-size: 16px;
  }
  .menu {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
  }
  .menu a {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
    font-size: 16px;
    text-decoration: none;
  }
  @media (max-width: 768px) {
    .menu a span {
      display: none;
    }
  }
`;
