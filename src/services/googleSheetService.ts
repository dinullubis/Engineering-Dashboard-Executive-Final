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
interface ApiAttendanceResponse {
  summary: {
    totalEmployee: number;
    hadir: number;
    sakit: number;
    ijin: number;
    cuti: number;
    attendanceRate: number;
  };
  trend: {
    date: string;
    hadir: number;
    sakit: number;
    ijin: number;
    cuti: number;
  }[];
  team: {
    team: string;
    hadir: number;
    sakit: number;
    ijin: number;
    cuti: number;
  }[];
}

interface ApiKorelasiResponse {
  openVsClosed: any[];
  breakdownVsNonBreakdown: any[];
  otVsBreakdown: any[];
}
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
let attendanceInFlight: Promise<ApiAttendanceResponse> | null = null;

async function fetchAttendance(): Promise<ApiAttendanceResponse> {

  if (attendanceInFlight) return attendanceInFlight;

  attendanceInFlight = apiFetch<ApiAttendanceResponse>('attendance')
    .catch(() => ({
      summary: {
        totalEmployee: 0,
        hadir: 0,
        sakit: 0,
        ijin: 0,
        cuti: 0,
        attendanceRate: 0,
      },
      trend: [],
      team: [],
    }))
    .finally(() => {
      attendanceInFlight = null;
    });

  return attendanceInFlight;

}

let korelasiInFlight: Promise<ApiKorelasiResponse> | null = null;

async function fetchKorelasi(): Promise<ApiKorelasiResponse> {

  if (korelasiInFlight) return korelasiInFlight;

  korelasiInFlight = apiFetch<ApiKorelasiResponse>("korelasi")
    .finally(() => {
      korelasiInFlight = null;
    });

  return korelasiInFlight;
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

  const wo = await apiFetch<WorkOrder[]>("wo");

  const open = wo.filter(x => x.status === "OPEN").length;

  const closed = wo.filter(x => x.status === "CLOSED").length;

  const breakdown = wo.filter(x => x.isBreakdown).length;

  const nonBreakdownHigh = wo.filter(
    x => x.category === "NON BKD HIGH"
  ).length;

  const nonBreakdownLow = wo.filter(
    x => x.category === "NON BKD LOW"
  ).length;

  const waitingPart = wo.filter(
    x => x.status === "WAITING PARTS"
  ).length;

  const waitingVendor = wo.filter(
    x => x.status === "WAITING VENDOR"
  ).length;

  const inProgress = wo.filter(
    x => x.status === "IN PROGRESS"
  ).length;

  const onHold = wo.filter(
    x => x.status === "ON HOLD"
  ).length;

  return {

    open,

    closed,

    breakdown,

    nonBreakdownHigh,

    nonBreakdownLow,

    waitingPart,

    waitingVendor,

    inProgress,

    onHold,

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

  async getWorkOrders(): Promise<WorkOrder[]> {
  return apiFetch<WorkOrder[]>("wo");
},
  async getTopEngineer(): Promise<Technician[]>                 { return []; },
  async getTrendData(): Promise<TrendPoint[]>                   { return []; },
  async getUtility(): Promise<UtilityData>                      { return { ...EMPTY_UTILITY_DATA }; },
  async getPM(): Promise<PMItem[]>                              { return []; },
  async getAlarms(): Promise<AlarmItem[]>                       { return []; },

  async getAttendanceSummary(): Promise<AttendanceSummary> {

  const a = await fetchAttendance();

  return {

    present: a.summary.hadir,

    absent:
      a.summary.sakit +
      a.summary.ijin +
      a.summary.cuti,

    sick: a.summary.sakit,

    leave:
      a.summary.ijin +
      a.summary.cuti,

    late: 0,

    total: a.summary.totalEmployee,

    presentPct: a.summary.attendanceRate,

  };

},

async getAttendanceTrend(): Promise<AttendanceTrend[]> {

  const a = await fetchAttendance();

  return (a.trend ?? []).map(row => ({

    date: row.date,

    present: row.hadir,

    absent:
      row.sakit +
      row.ijin +
      row.cuti,

    sick: row.sakit,

    leave:
      row.ijin +
      row.cuti,

    late: 0,

    overtime: 0,

  }));

},

async getAttendanceRecords(): Promise<AttendanceRecord[]> {

  return [];

},

  async getOvertimeRecords(): Promise<OvertimeRecord[]>         { return []; },
  async getTeamPerformance(): Promise<TeamPerformanceSummary[]> {

  return apiFetch<TeamPerformanceSummary[]>("team");

},
async getKorelasi(): Promise<ApiKorelasiResponse> {

  return fetchKorelasi();

},
};
