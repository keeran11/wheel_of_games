import { useState, useEffect, useRef } from 'react';
import Wheel from './components/Wheel';
import EntryManager from './components/EntryManager';
import Settings from './components/Settings';
import WinnerDisplay from './components/WinnerDisplay';
import Confetti from './components/Confetti';
import SponsorBanner from './components/SponsorBanner';
import SpinHistory from './components/SpinHistory';
import { getGameConfig } from './gameConfig';
import './App.css';

const DEFAULT_ENTRIES = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' },
  { id: 4, name: 'Diana' },
  { id: 5, name: 'Eve' }
];

const DEFAULT_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
  '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
  '#F8B739', '#52B788', '#FF8FAB', '#6C5CE7',
  '#A8E6CF', '#FFD93D', '#6BCF7F', '#95A5A6'
];

const game = getGameConfig();
document.title = game.title;

function App() {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem(game.storage.entries);
    return saved ? JSON.parse(saved) : DEFAULT_ENTRIES;
  });

  const [colors, setColors] = useState(() => {
    const saved = localStorage.getItem(game.storage.colors);
    return saved ? JSON.parse(saved) : DEFAULT_COLORS;
  });

  const [spinDuration, setSpinDuration] = useState(() => {
    const saved = localStorage.getItem('spinDuration');
    return saved ? Number(saved) : 5000;
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('soundEnabled');
    return saved ? JSON.parse(saved) : true;
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [wheelSize, setWheelSize] = useState(() => {
    const saved = localStorage.getItem('wheelSize');
    return saved ? Number(saved) : 500;
  });

  const [winner, setWinner] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const [spinHistory, setSpinHistory] = useState(() => {
    const saved = localStorage.getItem(game.storage.spinHistory);
    return saved ? JSON.parse(saved) : [];
  });

  const tickSoundRef = useRef(null);
  const winSoundRef = useRef(null);
  const wheelRef = useRef(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(game.storage.entries, JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem(game.storage.colors, JSON.stringify(colors));
  }, [colors]);

  useEffect(() => {
    localStorage.setItem('spinDuration', spinDuration);
  }, [spinDuration]);

  useEffect(() => {
    localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('wheelSize', wheelSize);
  }, [wheelSize]);

  useEffect(() => {
    localStorage.setItem(game.storage.spinHistory, JSON.stringify(spinHistory));
  }, [spinHistory]);

  // Create audio elements
  useEffect(() => {
    // Create tick sound (simple beep)
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    tickSoundRef.current = () => {
      if (!soundEnabled) return;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    };

    winSoundRef.current = () => {
      if (!soundEnabled) return;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = 'sine';

      // Play a celebratory melody
      const notes = [523.25, 659.25, 783.99]; // C, E, G
      notes.forEach((freq, i) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.frequency.value = freq;
        osc.type = 'sine';

        const startTime = audioContext.currentTime + (i * 0.15);
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

        osc.start(startTime);
        osc.stop(startTime + 0.3);
      });
    };
  }, [soundEnabled]);

  const handleWinner = (winningEntry) => {
    setWinner(winningEntry);
    setShowConfetti(true);

    // Add to history
    setSpinHistory(prev => [...prev, {
      winner: winningEntry.name,
      timestamp: Date.now()
    }]);

    if (winSoundRef.current) {
      winSoundRef.current();
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear the spin history?')) {
      setSpinHistory([]);
    }
  };

  const handleCloseWinner = () => {
    setWinner(null);
    setShowConfetti(false);
  };

  const handleRemoveWinner = () => {
    if (winner) {
      setEntries(entries.filter(entry => entry.id !== winner.id));
    }
  };

  const handleExport = () => {
    const data = {
      entries,
      colors,
      spinDuration,
      version: '1.0'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wheel-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (data) => {
    if (data.entries) setEntries(data.entries);
    if (data.colors) setColors(data.colors);
    if (data.spinDuration) setSpinDuration(data.spinDuration);
    alert('Wheel configuration imported successfully!');
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Space to spin (only if not typing in input)
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        e.preventDefault();
        if (wheelRef.current && entries.length > 0) {
          wheelRef.current.spin();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [entries]);

  return (
    <div className="app">
      <Settings
        spinDuration={spinDuration}
        onSpinDurationChange={setSpinDuration}
        soundEnabled={soundEnabled}
        onSoundEnabledChange={setSoundEnabled}
        darkMode={darkMode}
        onDarkModeChange={setDarkMode}
        wheelSize={wheelSize}
        onWheelSizeChange={setWheelSize}
        onExport={handleExport}
        onImport={handleImport}
      />

      <div className="app-header">
        <h1 className="app-title">{game.title}</h1>
        <p className="app-subtitle">{game.subtitle}</p>
      </div>

      <SponsorBanner />

      <div className="app-content">
        <div className="wheel-section">
          <Wheel
            ref={wheelRef}
            entries={entries}
            onWinner={handleWinner}
            spinDuration={spinDuration}
            colors={colors}
            wheelSize={wheelSize}
            soundEnabled={soundEnabled}
          />
        </div>

        <div className="controls-section">
          <EntryManager
            entries={entries}
            onEntriesChange={setEntries}
            colors={colors}
            onColorsChange={setColors}
            itemSingular={game.itemSingular}
            itemPlural={game.itemPlural}
          />
          <SpinHistory
            history={spinHistory}
            onClearHistory={handleClearHistory}
          />
        </div>
      </div>

      <WinnerDisplay
        winner={winner}
        onClose={handleCloseWinner}
        onRemoveWinner={handleRemoveWinner}
      />
      <Confetti active={showConfetti} />
    </div>
  );
}

export default App;
