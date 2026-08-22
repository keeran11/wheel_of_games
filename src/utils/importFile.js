export const parseCSV = (text) => {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          currentField += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      currentRow.push(currentField);
      currentField = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i++;
      currentRow.push(currentField);
      currentField = '';
      if (currentRow.some(cell => cell.trim() !== '')) {
        rows.push(currentRow);
      }
      currentRow = [];
    } else {
      currentField += char;
    }
  }

  currentRow.push(currentField);
  if (currentRow.some(cell => cell.trim() !== '')) {
    rows.push(currentRow);
  }

  if (rows.length === 0) return [];

  const headers = rows[0].map(h => h.trim().toLowerCase().replace(/^\uFEFF/, ''));
  const getCol = (...names) => {
    for (const name of names) {
      const idx = headers.indexOf(name);
      if (idx !== -1) return idx;
    }
    return -1;
  };

  const firstNameIdx = getCol('first_name', 'firstname', 'first name', 'given_name');
  const lastNameIdx = getCol('last_name', 'lastname', 'last name', 'surname', 'family_name');
  const nameIdx = getCol('name', 'full_name', 'fullname', 'full name');
  const emailIdx = getCol('email', 'email_address');

  return rows.slice(1).map(row => {
    if (firstNameIdx !== -1 || lastNameIdx !== -1) {
      const first = firstNameIdx !== -1 ? (row[firstNameIdx] || '').trim() : '';
      const last = lastNameIdx !== -1 ? (row[lastNameIdx] || '').trim() : '';
      const fullName = [first, last].filter(Boolean).join(' ').trim();
      if (fullName) return fullName;
    }
    if (nameIdx !== -1 && row[nameIdx]?.trim()) {
      return row[nameIdx].trim();
    }
    if (emailIdx !== -1 && row[emailIdx]?.trim()) {
      return row[emailIdx].split('@')[0].trim();
    }
    return null;
  }).filter(Boolean);
};

const extractNameFromObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) return null;

  const first = obj.first_name || obj.firstname || obj.firstName;
  const last = obj.last_name || obj.lastname || obj.lastName;

  if (first || last) {
    return [first, last].filter(Boolean).join(' ').trim() || null;
  }

  const name = obj.name || obj.full_name || obj.fullName;
  if (typeof name === 'string' && name.trim()) {
    return name.trim();
  }

  return null;
};

export const parseJSONEntries = (text) => {
  const data = JSON.parse(text);

  const items = Array.isArray(data)
    ? data
    : Array.isArray(data.entries)
      ? data.entries
      : Array.isArray(data.names)
        ? data.names
        : null;

  if (!items) {
    throw new Error('JSON must be an array of names/objects or have an "entries" or "names" array.');
  }

  return items
    .map(item => {
      if (typeof item === 'string') return item.trim();
      if (typeof item === 'number') return String(item);
      return extractNameFromObject(item);
    })
    .filter(Boolean);
};
