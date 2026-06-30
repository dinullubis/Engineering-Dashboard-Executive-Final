/**
 * Google Sheets Integration Configuration
 * PT. Taco Anugrah Corporindo — Engineering Executive Dashboard
 *
 * HOW TO ACTIVATE:
 * 1. Create a Google Cloud project and enable the Google Sheets API.
 * 2. Create a Service Account, download the JSON key.
 * 3. Share your spreadsheet with the Service Account email (Viewer role).
 * 4. Set the following environment variables in Replit Secrets:
 *    - VITE_GOOGLE_SPREADSHEET_ID  — the ID from the spreadsheet URL
 *    - VITE_GOOGLE_CLIENT_EMAIL    — service account email
 *    - VITE_GOOGLE_PRIVATE_KEY     — private key (with \n line breaks)
 *
 * SPREADSHEET SHEET NAMES (expected by googleSheetService.ts):
 *    "Summary"        — row 2 contains KPI values in columns A–H
 *    "WorkOrders"     — header row 1, data from row 2
 *    "PM"             — header row 1, data from row 2
 *    "Technicians"    — header row 1, data from row 2
 *    "DailyTrend"     — columns: Date, Value
 *    "WeeklyTrend"    — columns: Week, Value
 *    "MonthlyTrend"   — columns: Month, Value
 *    "BreakdownArea"  — columns: Area, Count
 *    "BreakdownMachine" — columns: Machine, Count
 *    "Downtime"       — columns: Cause, Hours, Cumulative%
 *    "Utility"        — single-row values for each utility metric
 *    "Alarms"         — header row 1, data from row 2
 */

export interface GoogleSheetsConfig {
  spreadsheetId: string;
  clientEmail: string;
  privateKey: string;
  scopes: string[];
}

export const GOOGLE_SHEETS_CONFIG: GoogleSheetsConfig = {
  spreadsheetId: import.meta.env.VITE_GOOGLE_SPREADSHEET_ID ?? '',
  clientEmail: import.meta.env.VITE_GOOGLE_CLIENT_EMAIL ?? '',
  privateKey: (import.meta.env.VITE_GOOGLE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
};

export const isGoogleSheetsConfigured = (): boolean =>
  Boolean(GOOGLE_SHEETS_CONFIG.spreadsheetId && GOOGLE_SHEETS_CONFIG.clientEmail);

/** Named ranges / sheet tabs used by googleSheetService */
export const SHEET_NAMES = {
  SUMMARY: 'Summary',
  WORK_ORDERS: 'WorkOrders',
  PM: 'PM',
  TECHNICIANS: 'Technicians',
  DAILY_TREND: 'DailyTrend',
  WEEKLY_TREND: 'WeeklyTrend',
  MONTHLY_TREND: 'MonthlyTrend',
  BREAKDOWN_AREA: 'BreakdownArea',
  BREAKDOWN_MACHINE: 'BreakdownMachine',
  DOWNTIME: 'Downtime',
  UTILITY: 'Utility',
  ALARMS: 'Alarms',
} as const;
