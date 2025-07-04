import { css } from 'lit';

export const confirmDialogStyles = css`
  .modal {
    display: none;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.4);
    padding-top: 60px;
  }
  .modal-content {
    width: 80%;
    max-width: var(--xs-breakpoint);
    margin: 10% auto;
    background-color: #fefefe;
    padding: 20px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    border-radius: 8px;
  }
  .modal-content .close {
    color: var(--ing-primary);
    float: right;
    font-size: 40px;
    margin-top: -8px;
  }
  .modal-content .close:hover {
    color: var(--ing-secondary);
  }
  .modal-content h2 {
    margin-top: 0;
    font-size: 28px;
    font-weight: normal;
    color: var(--ing-primary);
  }
  .modal-content p {
    margin: 32px 0;
  }
  .modal-content button {
    display: block;
    width: 100%;
    margin-top: 16px;
  }
  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
`;
