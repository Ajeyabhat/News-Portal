import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, isDangerous = false, isLoading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onCancel} title="Close">×</button>
        </div>

        <div className="modal-body">
          <div className={`confirm-icon ${isDangerous ? 'danger' : 'warning'}`}>
            {isDangerous ? '⚠️' : '❓'}
          </div>
          <p className="confirm-message">{message}</p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="modal-btn modal-btn-cancel"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`modal-btn ${isDangerous ? 'modal-btn-danger' : 'modal-btn-submit'}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? '⏳ Processing...' : isDangerous ? '🗑️ Delete' : '✓ Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
