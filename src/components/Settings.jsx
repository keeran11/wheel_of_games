import { useState } from 'react';
import './Settings.css';

const Settings = ({
  spinDuration,
  onSpinDurationChange,
  soundEnabled,
  onSoundEnabledChange,
  darkMode,
  onDarkModeChange,
  wheelSize,
  onWheelSizeChange,
  onExport,
  onImport
}) => {
  const [showSettings, setShowSettings] = useState(false);

  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            onImport(data);
          } catch (error) {
            alert('Invalid file format');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="settings-container">
      <button
        className="settings-toggle"
        onClick={() => setShowSettings(!showSettings)}
      >
        {showSettings ? '× Close' : '⚙ Settings'}
      </button>

      {showSettings && (
        <div className="settings-panel">
          <h3>Settings</h3>

          <div className="setting-group">
            <label>
              <span>Wheel Size</span>
              <div className="duration-control">
                <input
                  type="range"
                  min="300"
                  max="700"
                  step="50"
                  value={wheelSize}
                  onChange={(e) => onWheelSizeChange(Number(e.target.value))}
                />
                <span className="duration-value">{wheelSize}px</span>
              </div>
            </label>
          </div>

          <div className="setting-group">
            <label>
              <span>Spin Duration</span>
              <div className="duration-control">
                <input
                  type="range"
                  min="2000"
                  max="10000"
                  step="500"
                  value={spinDuration}
                  onChange={(e) => onSpinDurationChange(Number(e.target.value))}
                />
                <span className="duration-value">{spinDuration / 1000}s</span>
              </div>
            </label>
          </div>

          <div className="setting-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => onSoundEnabledChange(e.target.checked)}
              />
              <span>Sound Effects</span>
            </label>
          </div>

          <div className="setting-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => onDarkModeChange(e.target.checked)}
              />
              <span>Dark Mode</span>
            </label>
          </div>

          <div className="setting-group">
            <h4>Data Management</h4>
            <div className="data-buttons">
              <button onClick={onExport} className="btn-export">
                Export Wheel
              </button>
              <button onClick={handleImportClick} className="btn-import">
                Import Wheel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
