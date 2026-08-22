import { useState } from 'react';
import './SpinHistory.css';

const SpinHistory = ({ history, onClearHistory }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getWinnerStats = () => {
    const stats = {};
    history.forEach(entry => {
      stats[entry.winner] = (stats[entry.winner] || 0) + 1;
    });
    return Object.entries(stats)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  };

  const stats = getWinnerStats();

  return (
    <div className="spin-history">
      <div className="history-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>
          Spin History ({history.length})
          <span className="toggle-icon">{isExpanded ? '▼' : '▶'}</span>
        </h3>
      </div>

      {isExpanded && (
        <div className="history-content">
          {history.length === 0 ? (
            <p className="no-history">No spins yet. Spin the wheel to start!</p>
          ) : (
            <>
              <div className="history-actions">
                <button onClick={onClearHistory} className="btn-clear-history">
                  Clear History
                </button>
              </div>

              <div className="stats-section">
                <h4>Winner Statistics</h4>
                <div className="stats-list">
                  {stats.map((stat, index) => (
                    <div key={index} className="stat-item">
                      <span className="stat-name">{stat.name}</span>
                      <div className="stat-bar-container">
                        <div
                          className="stat-bar"
                          style={{ width: `${(stat.count / history.length) * 100}%` }}
                        />
                      </div>
                      <span className="stat-count">{stat.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="history-list">
                <h4>Recent Spins</h4>
                {history.slice().reverse().slice(0, 10).map((entry, index) => (
                  <div key={index} className="history-item">
                    <span className="history-winner">{entry.winner}</span>
                    <span className="history-time">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SpinHistory;
