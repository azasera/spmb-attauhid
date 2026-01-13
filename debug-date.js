// Test script untuk debug date conversion
// Jalankan di browser console untuk melihat hasil konversi

const testDates = [
    '18/07/2005',  // DD/MM/YYYY format
    '2005-07-18',  // YYYY-MM-DD format
    '38550',       // Excel serial date untuk 18 Juli 2005
    '18-07-2005',  // DD-MM-YYYY format
];

const normalizeDate = (dateStr) => {
    if (!dateStr) return '';

    const str = String(dateStr).trim();

    // Try Excel serial date first (most common from Excel)
    const serialDate = parseFloat(str);
    if (!isNaN(serialDate) && serialDate > 100 && serialDate < 100000) {
        // Excel serial date (days since 1900-01-01)
        // Use UTC to avoid timezone offset issues
        const excelEpoch = new Date(Date.UTC(1899, 11, 30));
        const date = new Date(excelEpoch.getTime() + serialDate * 86400000);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        console.log(`Serial ${serialDate} -> ${year}-${month}-${day}`);
        return `${year}-${month}-${day}`;
    }

    // Format: DD/MM/YYYY or DD-MM-YYYY
    const ddmmyyyyMatch = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (ddmmyyyyMatch) {
        const [, day, month, year] = ddmmyyyyMatch;
        console.log(`DD/MM/YYYY ${str} -> ${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    // Format: YYYY-MM-DD (already correct)
    const yyyymmddMatch = str.match(/^\d{4}-\d{2}-\d{2}$/);
    if (yyyymmddMatch) {
        console.log(`YYYY-MM-DD ${str} -> ${str}`);
        return str;
    }

    // Format: YYYY/MM/DD
    const yyyymmddSlashMatch = str.match(/^(\d{4})[\/](\d{1,2})[\/](\d{1,2})$/);
    if (yyyymmddSlashMatch) {
        const [, year, month, day] = yyyymmddSlashMatch;
        console.log(`YYYY/MM/DD ${str} -> ${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    console.log(`No match for: ${str}`);
    return str;
};

console.log('=== Testing Date Conversion ===');
testDates.forEach(date => {
    const result = normalizeDate(date);
    console.log(`Input: "${date}" -> Output: "${result}"`);
    console.log('---');
});
