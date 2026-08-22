import { useRef, useState } from 'react';
import { parseCSV, parseJSONEntries } from '../utils/importFile';
import './EntryManager.css';

const QUANTITY_REGEX = /^(.+?)\s*=\s*(\d{1,3})$/;

const expandEntryLine = (line) => {
  const trimmed = line.trim();
  if (!trimmed) return [];
  const match = trimmed.match(QUANTITY_REGEX);
  if (match && match[1].trim()) {
    const count = Math.min(Math.max(parseInt(match[2], 10), 1), 999);
    return Array.from({ length: count }, () => match[1].trim());
  }
  return [trimmed];
};

const makeEntries = (names) =>
  names.map(name => ({ id: Date.now() + Math.random(), name }));

const EntryManager = ({ entries, onEntriesChange, colors, onColorsChange, itemSingular = 'name', itemPlural = 'names' }) => {
  const [inputValue, setInputValue] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const fileInputRef = useRef(null);

  const handleAddEntry = () => {
    const names = expandEntryLine(inputValue);
    if (names.length > 0) {
      onEntriesChange([...entries, ...makeEntries(names)]);
      setInputValue('');
    }
  };

  const handleBulkAdd = () => {
    const names = bulkInput.split('\n').flatMap(expandEntryLine);

    if (names.length > 0) {
      onEntriesChange([...entries, ...makeEntries(names)]);
      setBulkInput('');
      setShowBulkAdd(false);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...entries];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    onEntriesChange(shuffled);
  };

  const appendNames = (names) => {
    const newEntries = names.map(name => ({
      id: Date.now() + Math.random(),
      name
    }));
    onEntriesChange([...entries, ...newEntries]);
  };

  const handleFileImport = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    if (!['csv', 'json'].includes(ext)) {
      setImportStatus({ type: 'error', message: 'Unsupported file. Please upload a .csv or .json file.' });
      return;
    }

    try {
      const text = await file.text();
      let names;

      if (ext === 'csv') {
        names = parseCSV(text);
      } else {
        names = parseJSONEntries(text);
      }

      if (names.length === 0) {
        setImportStatus({ type: 'error', message: `No names found in "${file.name}". Expected columns: first_name / last_name or name.` });
        return;
      }

      appendNames(names);
      setImportStatus({ type: 'success', message: `Imported ${names.length} ${names.length === 1 ? 'entry' : 'entries'} from "${file.name}".` });
    } catch (err) {
      setImportStatus({ type: 'error', message: `Failed to import "${file.name}": ${err.message}` });
    }
  };

  const handleRemoveEntry = (id) => {
    onEntriesChange(entries.filter(entry => entry.id !== id));
  };

  const handleEditEntry = (id, newName) => {
    onEntriesChange(
      entries.map(entry =>
        entry.id === id ? { ...entry, name: newName } : entry
      )
    );
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all entries?')) {
      onEntriesChange([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddEntry();
    }
  };

  const handleColorChange = (index, color) => {
    const newColors = [...colors];
    newColors[index] = color;
    onColorsChange(newColors);
  };

  return (
    <div className="entry-manager">
      <div className="entry-header">
        <h2>Entries ({entries.length})</h2>
        <div className="entry-actions">
          <button
            onClick={handleShuffle}
            className="btn-secondary"
            disabled={entries.length < 2}
          >
            Shuffle
          </button>
          <button onClick={() => { setShowBulkAdd(!showBulkAdd); setImportStatus(null); }} className="btn-secondary">
            {showBulkAdd ? 'Single Add' : 'Bulk Add'}
          </button>
          {entries.length > 0 && (
            <button onClick={handleClearAll} className="btn-danger">
              Clear All
            </button>
          )}
        </div>
      </div>

      {showBulkAdd ? (
        <div className="bulk-add-container">
          <div className="file-import-container">
            <input
              type="file"
              accept=".csv,.json"
              onChange={handleFileImport}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            <button onClick={() => fileInputRef.current?.click()} className="btn-secondary btn-file-import">
              Import CSV / JSON
            </button>
            <p className="file-import-hint">
              CSV with <code>first_name</code>/<code>last_name</code> (or <code>name</code>) columns, or a JSON array of names/objects.
            </p>
          </div>

          {importStatus && (
            <p className={`import-status ${importStatus.type === 'error' ? 'import-error' : 'import-success'}`}>
              {importStatus.message}
            </p>
          )}

          <div className="divider"><span>or paste names</span></div>

          <textarea
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            placeholder={`Enter ${itemPlural} (one per line)`}
            rows="6"
            className="bulk-textarea"
          />
          <p className="bulk-hint">
            Tip: use <code>{itemSingular} = 3</code> to add three copies at once.
          </p>
          <button onClick={handleBulkAdd} className="btn-primary">
            Add All
          </button>
        </div>
      ) : (
        <div className="add-entry-container">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Enter a ${itemSingular}`}
            className="entry-input"
          />
          <button onClick={handleAddEntry} className="btn-primary">
            Add
          </button>
        </div>
      )}

      <div className="entries-list">
        {entries.length === 0 ? (
          <p className="empty-message">No entries yet. Add some {itemPlural} to get started!</p>
        ) : (
          entries.map((entry, index) => (
            <div key={entry.id} className="entry-item">
              <div
                className="entry-color"
                style={{ backgroundColor: colors[index % colors.length] }}
                title="Click to change color"
              >
                <input
                  type="color"
                  value={colors[index % colors.length]}
                  onChange={(e) => handleColorChange(index % colors.length, e.target.value)}
                  className="color-picker"
                />
              </div>
              <input
                type="text"
                value={entry.name}
                onChange={(e) => handleEditEntry(entry.id, e.target.value)}
                className="entry-name-input"
              />
              <button
                onClick={() => handleRemoveEntry(entry.id)}
                className="btn-remove"
                title="Remove"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EntryManager;
