/**
 * Dashboard Service — PT. Taco Anugrah Corporindo
 *
 * Thin adapter between useDashboard (TanStack Query) and googleSheetService.
 * Every call is wrapped in a try/catch so a single endpoint failure never
 * crashes the UI — instead it returns a safe empty-state.
 *
 * Data flow:
 *   React pages → useDashboard → dashboardService → googleSheetService → Apps Script API
 */

import { googleSheetService } from './googleSheetService';
import type {
  KPISummary, WorkOrder, Technician, TrendPoint,
  UtilityData, PMItem, AlarmItem, FilterState,
  AttendanceSummary, AttendanceTrend, AttendanceRecord,
  OvertimeSummary, OvertimeRecord,
  TeamPerformanceSummary, WorkOrderSummaryExtended,
} from '../types';

/* ── Safe wrapper ─────────────────────────────────────────── */

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.warn('[dashboardService] API call failed — returning empty state:', err);
    return fallback;
  }
}

/* ── Empty-state constants ────────────────────────────────── */

const EMPTY_KPI: KPISummary = {
  totalWO:      { value: 0, trend: 0 },
  openWO:       { value: 0, trend: 0 },
  closedWO:     { value: 0, trend: 0 },
  breakdown:    { value: 0, trend: 0 },
  availability: { value: 0, trend: 0 },
  mttr:         { value: 0, trend: 0 },
  mtbf:         { value: 0, trend: 0 },
  pmCompliance: { value: 0, trend: 0 },
};

const EMPTY_WO_EXT: WorkOrderSummaryExtended = {
  open: 0, closed: 0, breakdown: 0,
  nonBreakdownHigh: 0, nonBreakdownLow: 0,
  waitingPart: 0, waitingVendor: 0, inProgress: 0, onHold: 0,
};

const EMPTY_ATT: AttendanceSummary = {
  present: 0, absent: 0, sick: 0, leave: 0, late: 0, total: 0, presentPct: 0,
};

const EMPTY_OT: OvertimeSummary = {
  totalHours: 0, employeesOnOT: 0, avgHoursPerEmployee: 0,
  byShift: [], byTeam: [], trend: [],
};

const EMPTY_UTILITY: UtilityData = {
  steam:         { current: 0, trend: [], status: 'NORMAL' },
  boiler: {
    pressure:    { current: 0, trend: [], status: 'NORMAL' },
    temperature: { current: 0, trend: [], status: 'NORMAL' },
    status: 'NORMAL',
  },
  power:         { current: 0, trend: [], peak: 0, offPeak: 0, status: 'NORMAL' },
  compressedAir: { current: 0, trend: [], status: 'NORMAL' },
  water:         { current: 0, trend: [], status: 'NORMAL' },
};

/* ── Service ──────────────────────────────────────────────── */

export const dashboardService = {

  /* ─── Live from ?action=summary ────────────────────────── */

  async getSummary(_f: FilterState): Promise<KPISummary> {
    // Not wrapped in safe() — lets TanStack Query set isError=true on failure
    // so the dashboard shows its retry screen rather than silently zeros.
    return googleSheetService.getSummary().catch((err: unknown) => {
      console.error('[dashboardService] getSummary failed:', err);
      throw err;
    });
  },

  async getWOSummaryExtended(_f: FilterState): Promise<WorkOrderSummaryExtended> {
    return safe(() => googleSheetService.getWOSummaryExtended(), EMPTY_WO_EXT);
  },

  async getOvertimeSummary(_f: FilterState): Promise<OvertimeSummary> {
    return safe(() => googleSheetService.getOvertimeSummary(), EMPTY_OT);
  },

  /* ─── Pending — empty until Apps Script implements them ─── */

  async getOpenWO(_f: FilterState): Promise<WorkOrder[]>              { return safe(() => googleSheetService.getWorkOrders(), []); },
  async getLongestOpenWOs(_f: FilterState): Promise<WorkOrder[]>      { return safe(() => googleSheetService.getWorkOrders(), []); },
  async getTopEngineer(_f: FilterState): Promise<Technician[]> {
  alert("GET TOP ENGINEER");

  return safe(
    () => googleSheetService.getTopEngineer(),
    []
  );
},
  async getDailyTrend(_f: FilterState): Promise<TrendPoint[]>         { return safe(() => googleSheetService.getTrendData(), []); },
  async getWeeklyTrend(_f: FilterState): Promise<TrendPoint[]>        { return safe(() => googleSheetService.getTrendData(), []); },
  async getMonthlyTrend(_f: FilterState): Promise<TrendPoint[]>       { return safe(() => googleSheetService.getTrendData(), []); },
  async getBreakdownArea(_f: FilterState): Promise<TrendPoint[]>      { return safe(() => googleSheetService.getTrendData(), []); },
  async getBreakdownMachine(_f: FilterState): Promise<TrendPoint[]>   { return safe(() => googleSheetService.getTrendData(), []); },
  async getDowntime(_f: FilterState): Promise<TrendPoint[]>           { return safe(() => googleSheetService.getTrendData(), []); },
  async getWOCategory(_f: FilterState): Promise<TrendPoint[]>         { return safe(() => googleSheetService.getTrendData(), []); },
  async getWOStatus(_f: FilterState): Promise<TrendPoint[]>           { return safe(() => googleSheetService.getTrendData(), []); },
  async getMTTRTrend(_f: FilterState): Promise<TrendPoint[]>          { return safe(() => googleSheetService.getTrendData(), []); },
  async getMTBFTrend(_f: FilterState): Promise<TrendPoint[]>          { return safe(() => googleSheetService.getTrendData(), []); },
  async getAlarm(_f: FilterState): Promise<AlarmItem[]>               { return safe(() => googleSheetService.getAlarms(), []); },
  async getPM(_f: FilterState): Promise<PMItem[]>                     { return safe(() => googleSheetService.getPM(), []); },
  async getAttendanceSummary(_f: FilterState): Promise<AttendanceSummary>    { return safe(() => googleSheetService.getAttendanceSummary(), EMPTY_ATT); },
  async getAttendanceTrend(_f: FilterState): Promise<AttendanceTrend[]>      { return safe(() => googleSheetService.getAttendanceTrend(), []); },
  async getAttendanceRecords(_f: FilterState): Promise<AttendanceRecord[]>   { return safe(() => googleSheetService.getAttendanceRecords(), []); },
  async getOvertimeRecords(_f: FilterState): Promise<OvertimeRecord[]>       { return safe(() => googleSheetService.getOvertimeRecords(), []); },
  async getTeamPerformance(_f: FilterState): Promise<TeamPerformanceSummary[]> { return safe(() => googleSheetService.getTeamPerformance(), []); },
  async getOpenVsClosedTrend(_f: FilterState): Promise<any[]> {
  return safe(
    async () => (await googleSheetService.getKorelasi()).openVsClosed,
    []
  );
},

async getOTvsBreakdown(_f: FilterState): Promise<any[]> {
  return safe(
    async () => (await googleSheetService.getKorelasi()).otVsBreakdown,
    []
  );
},

async getBreakdownVsNonBreakdown(_f: FilterState): Promise<any[]> {
  return safe(
    async () => (await googleSheetService.getKorelasi()).breakdownVsNonBreakdown,
    []
  );
},

  async getUtility(_f: FilterState): Promise<UtilityData> {
    return safe(() => googleSheetService.getUtility(), EMPTY_UTILITY);
  },
};
