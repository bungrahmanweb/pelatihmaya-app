import React from 'react';

export default function ConfirmDialog({ message, onConfirm, onCancel }: any) {
  return (
    <div className="confirm-dialog">
      <p>{message}</p>
      <button onClick={onConfirm}>Yes</button>
      <button onClick={onCancel}>No</button>
    </div>
  );
}
