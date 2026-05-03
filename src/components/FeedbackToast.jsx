import { useEffect } from 'react';
import './FeedbackToast.css';

export default function FeedbackToast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return undefined;

    const timeout = window.setTimeout(onClose, 2800);
    return () => window.clearTimeout(timeout);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className={`feedback-toast feedback-toast--${toast.type || 'success'}`} role="status" aria-live="polite">
      <span className="feedback-toast__mark" />
      <div className="feedback-toast__content">
        <strong>{toast.title}</strong>
        {toast.message && <p>{toast.message}</p>}
      </div>
      <button type="button" onClick={onClose} aria-label="Cerrar notificacion">
        x
      </button>
    </div>
  );
}
