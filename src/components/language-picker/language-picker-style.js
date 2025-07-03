import { css } from 'lit';

export const languagePickerStyles = css`
  button {
    outline: none;
    border: none;
    background: transparent;
    cursor: pointer;
  }
  .lang-dropdown {
    position: relative;
    display: inline-block;
  }
  .lang-dropdown .dropbtn {
    background-color: transparent;
    border: 0;
    border-radius: 8px;
    padding: 8px;
    transition: background-color 0.3s ease;
  }
  .lang-dropdown:hover .dropbtn {
    background-color: #ddd;
  }
  .lang-dropdown .dropdown-content {
    max-height: 0;
    opacity: 0;
    position: absolute;
    margin-top: 12px;
    right: 0;
    min-width: 160px;
    z-index: 1;
    background-color: #f9f9f9;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    transition: opacity 0.3s ease, max-height 0.3s ease;
    overflow: hidden;
  }
  .lang-dropdown:hover .dropdown-content {
    opacity: 1;
    max-height: 120px;
  }
  .lang-dropdown .dropdown-content a {
    display: flex;
    align-items: center;
    gap: 16px;
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    transition: background-color 0.3s ease;
  }
  .lang-dropdown .dropdown-content a:hover {
    background-color: #ddd;
  }
`;
