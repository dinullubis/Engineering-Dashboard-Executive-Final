/**
 * Google Apps Script API Service — PT. Taco Anugrah Corporindo
 *
 * Single source of truth for all live data from the Google Apps Script web app.
 * Only ?action=summary is currently implemented on the server side.
 * All other actions return safe empty-state defaults until the Apps Script is extended.
 *
 * API Base: https://script.google.com/macros/s/.../exec
 * Implemented:  ?action=summary
 * Pending:      ?action=wo | attendance | team | korelasi
 */

import type {
  ApiSummaryResponse,
  KPISummary,
  WorkOrder,
  Technician,
  TrendPoint,
  UtilityData,
  PMItem,
  AlarmItem,
  AttendanceSummary,
  AttendanceTrend,
  AttendanceRecord,
  OvertimeSummary,
  OvertimeRecord,
  TeamPerformanceSummary,
  WorkOrderSummaryExtended,
} from '../types';

/* ── Config ──────────────────────────────────────────────── */

const BASE_URL =
  'https://script.google.com/macros/s/AKfycbybsu33aTyLj99dGAewVwSZD8rUGNukhQZL2a7P_m4tblcC8hyNC4hShelYBMwUnlgd/exec';

/* ── Core fetch ──────────────────────────────────────────── */

async function apiFetch<T>(action: string): Promise<T> {
  const res = await fetch(`${BASE_URL}?action=${action}`, {
    method: 'GET',
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`Apps Script HTTP ${res.status} for action=${action}`);
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Invalid JSON from action=${action}: ${text.slice(0, 120)}`);
  }
}

/* ── In-flight deduplication for summary ────────────────── */
// Multiple service functions derive data from the same ?action=summary call.
// This prevents duplicate in-flight requests when TanStack Query fires them
// simultaneously on mount.

let summaryInFlight: Promise<ApiSummaryResponse> | null = null;

async function fetchSummary(): Promise<ApiSummaryResponse> {
  if (summaryInFlight) return summaryInFlight;
  summaryInFlight = apiFetch<ApiSummaryResponse>('summary').finally(() => {
    summaryInFlight = null;
  });
  return summaryInFlight;
}

/* ── Safe metric helper ──────────────────────────────────── */

const m = (metric: { value: number; trend: number } | undefined, fallback = 0) => ({
  value: metric?.value ?? fallback,
  trend: metric?.trend ?? 0,
});

/* ── Empty-state constants ───────────────────────────────── */

const EMPTY_UTILITY_READING = { current: 0, trend: [] as number[], status: 'NORMAL' as const };

const EMPTY_UTILITY_DATA: UtilityData = {
  steam:         { ...EMPTY_UTILITY_READING },
  boiler: {
    pressure:    { ...EMPTY_UTILITY_READING },
    temperature: { ...EMPTY_UTILITY_READING },
    status: 'NORMAL',
  },
  power: { current: 0, trend: [], peak: 0, offPeak: 0, status: 'NORMAL' },
  compressedAir: { ...EMPTY_UTILITY_READING },
  water:         { ...EMPTY_UTILITY_READING },
};

const EMPTY_ATTENDANCE_SUMMARY: AttendanceSummary = {
  present: 0, absent: 0, sick: 0, leave: 0, late: 0, total: 0, presentPct: 0,
};

const EMPTY_OVERTIME_SUMMARY: OvertimeSummary = {
  totalHours: 0, employeesOnOT: 0, avgHoursPerEmployee: 0,
  byShift: [], byTeam: [], trend: [],
};

/* ── Public service ──────────────────────────────────────── */

export const googleSheetService = {

  /* ─── ?action=summary — LIVE ──────────────────────────── */

  async getSummary(): Promise<KPISummary> {
    const s = await fetchSummary();
    const open   = s.woOpen?.value  ?? 0;
    const closed = s.woClose?.value ?? 0;
    return {
      totalWO:      { value: open + closed, trend: 0 },
      openWO:       m(s.woOpen),
      closedWO:     m(s.woClose),
      breakdown:    m(s.breakdown),
      availability: m(s.availability),
      mttr:         m(s.mttr),
      mtbf:         m(s.mtbf),
      pmCompliance: { value: 0, trend: 0 }, // not yet in API
    };
  },

  async getWOSummaryExtended(): Promise<WorkOrderSummaryExtended> {
    const s = await fetchSummary();
    return {
      open:             s.woOpen?.value    ?? 0,
      closed:           s.woClose?.value   ?? 0,
      breakdown:        s.breakdown?.value ?? 0,
      nonBreakdownHigh: 0, // pending ?action=wo
      nonBreakdownLow:  0,
      waitingPart:      0,
      waitingVendor:    0,
      inProgress:       0,
      onHold:           0,
    };
  },

  async getOvertimeSummary(): Promise<OvertimeSummary> {
    const s = await fetchSummary();
    return {
      ...EMPTY_OVERTIME_SUMMARY,
      totalHours: s.totalOT?.value ?? 0,
    };
  },

  /* ─── Pending endpoints — safe empty defaults ─────────── */
  // These will be replaced once getWO / getAttendance / getTeam /
  // getKorelasi are implemented in the Apps Script.

  async getWorkOrders(): Promise<WorkOrder[]>                   { return []; },
  async getTopEngineer(): Promise<Technician[]>                 { return []; },
  async getTrendData(): Promise<TrendPoint[]>                   { return []; },
  async getUtility(): Promise<UtilityData>                      { return { ...EMPTY_UTILITY_DATA }; },
  async getPM(): Promise<PMItem[]>                              { return []; },
  async getAlarms(): Promise<AlarmItem[]>                       { return []; },

  async getAttendanceSummary(): Promise<AttendanceSummary>      { return { ...EMPTY_ATTENDANCE_SUMMARY }; },
  async getAttendanceTrend(): Promise<AttendanceTrend[]>        { return []; },
  async getAttendanceRecords(): Promise<AttendanceRecord[]>     { return []; },

  async getOvertimeRecords(): Promise<OvertimeRecord[]>         { return []; },
  async getTeamPerformance(): Promise<TeamPerformanceSummary[]> { return []; },
};
