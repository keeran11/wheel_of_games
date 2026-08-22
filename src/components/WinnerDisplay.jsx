import { useEffect, useState, useRef } from 'react';
import './WinnerDisplay.css';

const WinnerDisplay = ({ winner, onClose, onRemoveWinner }) => {
  const [show, setShow] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const timerRef = useRef(null);

  useEffect(() => {
    if (winner) {
      setShow(true);
      setCountdown(10);

      // Start countdown timer
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Auto-close and remove winner
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            setShow(false);
            setTimeout(() => {
              onRemoveWinner();
              onClose(false);
            }, 300);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [winner, onClose, onRemoveWinner]);

  const handleClose = (keepWinner = true) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setShow(false);
    setTimeout(() => {
      onClose(keepWinner);
    }, 300);
  };

  const handleRemoveWinner = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setShow(false);
    setTimeout(() => {
      onRemoveWinner();
      onClose(false);
    }, 300);
  };

  if (!winner) return null;

  return (
    <div className={`winner-overlay ${show ? 'show' : ''}`}>
      <div className="winner-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={() => handleClose(true)}>×</button>
        <div className="winner-content">
          <h1 className="winner-title">Winner!</h1>
          <div className="winner-name">{winner.name}</div>
          <p className="winner-subtitle">Congratulations!</p>

          <div className="winner-actions">
            <button className="btn-remove-winner" onClick={handleRemoveWinner}>
              Remove from Wheel
            </button>
            <button className="btn-keep-winner" onClick={() => handleClose(true)}>
              Keep in Wheel
            </button>
          </div>

          <p className="auto-close-message">
            Auto-removing winner in {countdown} second{countdown !== 1 ? 's' : ''}...
          </p>
        </div>
      </div>
    </div>
  );
};

export default WinnerDisplay;
