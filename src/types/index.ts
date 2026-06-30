/* ── Google Apps Script API response shapes ─────── */
export interface ApiMetric {
  value: number;
  trend: number;
}

export interface ApiSummaryResponse {
  availability: ApiMetric;
  mttr:         ApiMetric;
  mtbf:         ApiMetric;
  totalOT:      ApiMetric;
  woClose:      ApiMetric;
  breakdown:    ApiMetric;
  downtime:     ApiMetric;
  woOpen:       ApiMetric;
}

export interface WorkOrder {
  id: string;
  woNumber: string;
  machine: string;
  area: string;
  category: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'IN PROGRESS' | 'WAITING PARTS' | 'WAITING VENDOR' | 'ON HOLD' | 'CLOSED';
  openedDate: string;
  durationHours: number;
  pic: string;
  description: string;
  team?: string;
  shift?: string;
  isBreakdown?: boolean;
  breakdownLevel?: 'HIGH' | 'LOW' | null;
}

export interface Technician {
  id: string;
  name: string;
  team: string;
  completionRate: number;
  avgResponseTime: number;
  avgRepairTime: number;
  totalWO: number;
  shift?: string;
}

export interface KPISummary {
  totalWO: { value: number; trend: number };
  openWO: { value: number; trend: number };
  closedWO: { value: number; trend: number };
  breakdown: { value: number; trend: number };
  availability: { value: number; trend: number };
  mttr: { value: number; trend: number };
  mtbf: { value: number; trend: number };
  pmCompliance: { value: number; trend: number };
}

export interface TrendPoint {
  date: string;
  value: number;
  [key: string]: any;
}

export interface UtilityReading {
  current: number;
  trend: number[];
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
}

export interface UtilityData {
  steam: UtilityReading;
  boiler: { pressure: UtilityReading; temperature: UtilityReading; status: 'NORMAL' | 'WARNING' | 'CRITICAL' };
  power: { current: number; trend: number[]; peak: number; offPeak: number; status: 'NORMAL' | 'WARNING' | 'CRITICAL' };
  compressedAir: UtilityReading;
  water: UtilityReading;
}

export interface PMItem {
  id: string;
  machine: string;
  area: string;
  lastDone: string;
  nextDue: string;
  technician: string;
  status: 'upcoming' | 'due' | 'overdue';
}

export interface AlarmItem {
  id: string;
  woNumber: string;
  machine: string;
  area: string;
  duration: number;
  type: 'critical' | 'parts' | 'vendor' | 'late';
  priority?: 'CRITICAL' | 'HIGH';
  team?: string;
}

export interface FilterState {
  period: 'Today' | 'Yesterday' | 'This Week' | 'This Month' | 'Custom Date';
  startDate?: Date;
  endDate?: Date;
  area: string;
  machine: string;
  category: string;
  shift: string;
  team: string;
  employee: string;
  woStatus: string;
  woCategory: string;
}

/* ── Attendance ─────────────────────────────────── */
export interface AttendanceSummary {
  present: number;
  absent: number;
  sick: number;
  leave: number;
  late: number;
  total: number;
  presentPct: number;
}

export interface AttendanceTrend {
  date: string;
  present: number;
  absent: number;
  sick: number;
  leave: number;
  late: number;
  overtime: number;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  name: string;
  team: string;
  shift: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'PRESENT' | 'ABSENT' | 'SICK' | 'LEAVE' | 'LATE';
  otHours: number;
}

/* ── Overtime ────────────────────────────────────── */
export interface OvertimeSummary {
  totalHours: number;
  employeesOnOT: number;
  avgHoursPerEmployee: number;
  byShift: { shift: string; hours: number; employees: number }[];
  byTeam: { team: string; hours: number; employees: number }[];
  trend: { date: string; hours: number; employees: number }[];
}

export interface OvertimeRecord {
  id: string;
  employeeId: string;
  name: string;
  team: string;
  shift: string;
  date: string;
  hours: number;
  reason: string;
  approvedBy: string;
}

/* ── Team Performance ────────────────────────────── */
export interface TeamPerformanceSummary {
  id: string;
  team: string;
  leader: string;
  members: number;
  completionRate: number;
  avgResponseTime: number;
  avgRepairTime: number;
  totalWO: number;
  breakdown: number;
  otHours: number;
}

/* ── Extended WO Summary ─────────────────────────── */
export interface WorkOrderSummaryExtended {
  open: number;
  closed: number;
  breakdown: number;
  nonBreakdownHigh: number;
  nonBreakdownLow: number;
  waitingPart: number;
  waitingVendor: number;
  inProgress: number;
  onHold: number;
}
