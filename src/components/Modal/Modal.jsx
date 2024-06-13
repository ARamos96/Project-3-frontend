import React from 'react';
import './Modal.css';

const Modal = ({ show, handleClose, handleConfirm, heading, message, confirmMessage, closeMessage }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{heading}</h2>
        <p className='p-modal'>{message}</p>
        <div className="modal-buttons">
          {handleConfirm && <button onClick={handleConfirm}>{confirmMessage}</button>}
          <button onClick={handleClose}>{closeMessage}</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
