/**
 * Google Sheets API Integration
 * Fetches task data from a public Google Sheet
 */

const GOOGLE_SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
const SHEET_NAME = import.meta.env.VITE_GOOGLE_SHEET_NAME || 'Tasks';
const SHEET_GID = import.meta.env.VITE_GOOGLE_SHEET_GID || '0';

// CSV export URL for published sheets
const getSheetCSVUrl = () => {
  return `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/export?format=csv&gid=${SHEET_GID}`;
};

/**
 * Parse CSV data from Google Sheets (with proper quote handling)
 */
const parseCSV = (text) => {
  const lines = text.trim().split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  // Parse header row
  const headers = parseCSVLine(lines[0]);
  const data = [];

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    if (Object.values(row).some(v => v)) { // Only add non-empty rows
      data.push(row);
    }
  }

  return data;
};

/**
 * Parse a single CSV line, handling quoted values
 */
const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
};

/**
 * Fetch tasks from Google Sheet
 */
export const fetchTasks = async () => {
  try {
    const url = getSheetCSVUrl();
    console.log('🔄 Fetching Google Sheet from:', url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();
    console.log('📄 CSV fetched, first 200 chars:', csvText.substring(0, 200));

    // Check if response is HTML (sheet not published or access denied)
    // Only check for actual HTML at the start of the response
    if (csvText.trim().startsWith('<!DOCTYPE') || csvText.trim().startsWith('<html')) {
      console.error('❌ CRITICAL ERROR: Sheet Not Published to Web');
      console.error('');
      console.error('The CSV export returned HTML instead of CSV data.');
      console.error('This means your Google Sheet is NOT published to the web.');
      console.error('');
      console.error('🔴 REQUIRED FIX:');
      console.error('   1. Make sure your Google Sheet is published to web');
      console.error('   2. Click FILE menu (top left)');
      console.error('   3. Click SHARE');
      console.error('   4. Click PUBLISH TO WEB');
      console.error('   5. In dialog: Select "Entire document" (or your sheet)');
      console.error('   6. Make sure format shows "Web page (.html)"');
      console.error('   7. Click PUBLISH button');
      console.error('   8. See confirmation message');
      console.error('   9. Close the dialog');
      console.error('   10. THEN refresh this page (F5)');
      console.error('');
      console.error('Then your real data will load automatically.');
      return getMockData();
    }

    const data = parseCSV(csvText);
    console.log('✅ Parsed rows:', data.length);

    if (data.length === 0) {
      console.warn('⚠️  No data found in sheet. Check if:');
      console.warn('   - Sheet has data in it');
      console.warn('   - Column headers match: Platform, Project, Task, Dev, Status, Mandays, Priority, Start Date, End Date, Blocker, Go-Live, Impact');
      console.warn('   - Using mock data as fallback');
      return getMockData();
    }

    console.log('🎉 Successfully loaded', data.length, 'tasks from Google Sheet!');
    return data.map((row, idx) => ({
      id: idx + 1,
      platform: row['Platform'] || row['PLATFORM'] || '',
      project: row['Project'] || row['PROJECT'] || '',
      title: row['Task'] || row['TASK'] || '',
      dev: row['Dev'] || row['DEV'] || row['Assigned Dev'] || '',
      status: row['Status'] || row['STATUS'] || 'Backlog',
      mandays: parseFloat(row['Mandays'] || row['MANDAYS'] || 0) || 0,
      priority: row['Priority'] || row['PRIORITY'] || 'P2',
      startDate: row['Start Date'] || row['START_DATE'] || '',
      endDate: row['End Date'] || row['END_DATE'] || '',
      blocker: row['Blocker'] || row['BLOCKER'] || '',
      goLiveDate: row['Go-Live'] || row['GO_LIVE'] || '',
      impact: row['Impact'] || row['IMPACT'] || '',
    }));
  } catch (error) {
    console.error('❌ Error fetching Google Sheet:', error);
    console.error('');
    console.error('🔍 DEBUGGING INFO:');
    console.error('   - Check if you have internet connection');
    console.error('   - Verify Sheet ID is correct: ' + import.meta.env.VITE_GOOGLE_SHEET_ID);
    console.error('   - Make sure Google Sheet is published to web');
    console.error('');
    console.error('📋 STEPS TO FIX:');
    console.error('   1. Open your Google Sheet');
    console.error('   2. Click File → Share → Publish to web');
    console.error('   3. Keep the default settings and click "Publish"');
    console.error('   4. Refresh this page');
    console.error('');
    console.log('Using mock data as fallback');
    return getMockData();
  }
};

/**
 * Mock data for development/demo
 */
const getMockData = () => [
  {
    id: 1,
    platform: 'Website',
    project: 'Dashboard Redesign',
    title: 'Create new landing page',
    dev: 'Alice',
    status: 'In Progress',
    mandays: 5,
    priority: 'P0',
    startDate: '2025-12-01',
    endDate: '2025-12-10',
    blocker: '',
    goLiveDate: '2025-12-15',
    impact: 'Increase conversion rate by 20%',
  },
  {
    id: 2,
    platform: 'App',
    project: 'Mobile App v2',
    title: 'Implement authentication flow',
    dev: 'Bob',
    status: 'Backlog',
    mandays: 8,
    priority: 'P0',
    startDate: '2025-12-20',
    endDate: '2026-01-05',
    blocker: '',
    goLiveDate: '2026-01-10',
    impact: 'Core feature for app launch',
  },
  {
    id: 3,
    platform: 'Backend',
    project: 'API Optimization',
    title: 'Database query optimization',
    dev: 'Charlie',
    status: 'In Progress',
    mandays: 3,
    priority: 'P1',
    startDate: '2025-12-08',
    endDate: '2025-12-15',
    blocker: 'Waiting for performance metrics from ops',
    goLiveDate: '2025-12-18',
    impact: 'Reduce API response time by 40%',
  },
  {
    id: 4,
    platform: 'Website',
    project: 'Dashboard Redesign',
    title: 'Payment integration',
    dev: 'Alice',
    status: 'Blocked',
    mandays: 4,
    priority: 'P0',
    startDate: '2025-12-12',
    endDate: '2025-12-20',
    blocker: 'Waiting for payment provider API docs',
    goLiveDate: '2025-12-22',
    impact: 'Enable transactions',
  },
  {
    id: 5,
    platform: 'Infra',
    project: 'Infrastructure',
    title: 'Setup CI/CD pipeline',
    dev: 'David',
    status: 'Completed',
    mandays: 6,
    priority: 'P0',
    startDate: '2025-11-20',
    endDate: '2025-12-05',
    blocker: '',
    goLiveDate: '2025-12-05',
    impact: 'Automate deployment process',
  },
];
