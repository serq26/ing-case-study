import { css } from 'lit';

export const employeeListStyles = css`
  h2 {
    color: var(--ing-primary);
  }
  .table-container {
    max-width: 100%;
    overflow-x: scroll;
  }
  .table-actions {
    background-color: #ffffff;
    padding: 10px;
    border-radius: 12px 12px 0 0;
  }
  .search-box {
    background-color: #f7f7f7;
    padding: 10px;
    border-radius: 10px;
    border: 2px solid #f7f7f7;
    font-weight: 600;
    transition: all 0.4s ease-in-out;
    &:focus {
      border-color: var(--ing-primary);
    }
  }
  .delete-button {
    background-color: #eb4141;
    color: #ffffff;
    padding: 8px 20px;
    border-radius: 6px;
    margin-left: 6px;
    font-weight: bold;
    transition: all 0.3s ease-in-out;
    &:hover {
      background-color: #ba1818;
    }
  }
  .table-action-button {
    border: none;
    outline: none;
    background-color: transparent;
    transition: all 0.2s ease;
    &:hover {
      filter: brightness(0.5);
    }
  }
  .pagination-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    margin: 16px 0;
  }
  .page-button,
  .page-number {
    width: 30px;
    height: 30px;
    padding: 4px 8px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .page-button:disabled,
  .page-number:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .page-number.active {
    background: var(--ing-primary);
    border-color: var(--ing-primary);
    color: #fff;
    border-radius: 50%;
  }
  .page-ellipsis {
    padding: 4px 8px;
    color: #666;
  }

  .total-records {
    width: 200px;
  }

  .card-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
    padding: 0;
    list-style: none;
    margin: 0;
  }

  .card {
    background: #ffffff;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: transform 0.2s, box-shadow 0.2s;
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
    }
  }

  .card strong {
    font-size: 20px;
    color: #333;
  }

  .card span {
    font-size: 14px;
    color: #555;
    line-height: 1.5;
  }

  .card .flex-row {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 12px;
  }

  .flex-card-content {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
  }

  .flex-card-content-between {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .flex-card-content-between strong {
    font-weight: 600;
    font-size: 14px;
    color: var(--ing-primary);
  }

  table td.light {
    color: #7c7c7c;
    font-weight: 400;
  }

  th.sortable {
    user-select: none;
    white-space: nowrap;
  }

  th.sortable .sort-icon {
    margin-left: 4px;
    font-size: 14px;
    color: #999;
  }

  th.sortable.active .sort-icon {
    color: var(--ing-secondary);
  }

  .actions-cell {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    white-space: nowrap;
  }

  @media screen and (max-width: 768px) {
    .pagination-container {
      flex-direction: column;
    }
    .total-records {
      display: none;
    }
  }

  @media screen and (min-width: 768px) {
    .container-lg {
      padding: 20px;
    }
  }
`;
