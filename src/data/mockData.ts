import {
  KPISummary, WorkOrder, Technician, TrendPoint, UtilityData, PMItem, AlarmItem,
  AttendanceSummary, AttendanceTrend, AttendanceRecord,
  OvertimeSummary, OvertimeRecord,
  TeamPerformanceSummary, WorkOrderSummaryExtended,
} from '../types';

/* ── KPI Summary ───────────────────────────────── */
export const mockSummary: KPISummary = {
  totalWO:     { value: 1245, trend: 5.2 },
  openWO:      { value: 87,   trend: -2.1 },
  closedWO:    { value: 1158, trend: 6.4 },
  breakdown:   { value: 12,   trend: 15.0 },
  availability:{ value: 92.4, trend: 0.8 },
  mttr:        { value: 2.4,  trend: -5.0 },
  mtbf:        { value: 48.5, trend: 2.1 },
  pmCompliance:{ value: 88.5, trend: -1.2 },
};

/* ── Extended WO Summary ───────────────────────── */
export const mockWOSummaryExtended: WorkOrderSummaryExtended = {
  open: 87,
  closed: 1158,
  breakdown: 12,
  nonBreakdownHigh: 28,
  nonBreakdownLow: 47,
  waitingPart: 15,
  waitingVendor: 10,
  inProgress: 40,
  onHold: 5,
};

/* ── Trend data ─────────────────────────────────── */
export const mockDailyTrend: TrendPoint[] = Array.from({ length: 30 }).map((_, i) => ({
  date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
  value: Math.floor(Math.random() * 50) + 10,
}));

export const mockWeeklyTrend: TrendPoint[] = [
  { date: 'Wk 1', value: 182 }, { date: 'Wk 2', value: 214 },
  { date: 'Wk 3', value: 198 }, { date: 'Wk 4', value: 235 },
  { date: 'Wk 5', value: 221 }, { date: 'Wk 6', value: 267 },
  { date: 'Wk 7', value: 243 }, { date: 'Wk 8', value: 289 },
  { date: 'Wk 9', value: 254 }, { date: 'Wk 10', value: 311 },
  { date: 'Wk 11', value: 278 }, { date: 'Wk 12', value: 298 },
];

export const mockMonthlyTrend: TrendPoint[] = [
  { date: 'Jan', value: 720 },  { date: 'Feb', value: 680 },
  { date: 'Mar', value: 810 },  { date: 'Apr', value: 775 },
  { date: 'May', value: 920 },  { date: 'Jun', value: 880 },
  { date: 'Jul', value: 950 },  { date: 'Aug', value: 1010 },
  { date: 'Sep', value: 970 },  { date: 'Oct', value: 1080 },
  { date: 'Nov', value: 1130 }, { date: 'Dec', value: 1245 },
];

export const mockBreakdownArea: TrendPoint[] = [
  { date: 'Utilities',  value: 45 },
  { date: 'Packaging',  value: 120 },
  { date: 'Processing', value: 85 },
  { date: 'Finishing',  value: 65 },
  { date: 'QC',         value: 20 },
];

export const mockBreakdownMachine: TrendPoint[] = [
  { date: 'Packer A',     value: 45 }, { date: 'Boiler 1',   value: 38 },
  { date: 'Mixer B',      value: 32 }, { date: 'Conveyor 3', value: 28 },
  { date: 'Wrapper C',    value: 25 }, { date: 'Pump 2',     value: 19 },
  { date: 'Compressor 1', value: 15 }, { date: 'Dryer A',    value: 12 },
];

export const mockDowntime: TrendPoint[] = [
  { date: 'Motor Failure',   value: 120, cumulative: 30 },
  { date: 'Sensor Fault',    value: 80,  cumulative: 50 },
  { date: 'Belt Jam',        value: 60,  cumulative: 65 },
  { date: 'Power Loss',      value: 50,  cumulative: 77.5 },
  { date: 'Pneumatic Leak',  value: 40,  cumulative: 87.5 },
  { date: 'Other',           value: 50,  cumulative: 100 },
];

export const mockWOCategory: TrendPoint[] = [
  { date: 'Corrective',   value: 45 }, { date: 'Preventive', value: 35 },
  { date: 'Predictive',   value: 10 }, { date: 'Improvement', value: 10 },
];

export const mockWOStatus: TrendPoint[] = [
  { date: 'OPEN',           value: 30 }, { date: 'IN PROGRESS',   value: 40 },
  { date: 'WAITING PARTS',  value: 15 }, { date: 'WAITING VENDOR', value: 10 },
  { date: 'ON HOLD',        value: 5  },
];

export const mockMTTRTrend: TrendPoint[] = Array.from({ length: 30 }).map((_, i) => ({
  date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
  value: parseFloat((2 + Math.random() * 2).toFixed(2)),
}));

export const mockMTBFTrend: TrendPoint[] = Array.from({ length: 30 }).map((_, i) => ({
  date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
  value: parseFloat((40 + Math.random() * 20).toFixed(1)),
}));

/* ── Open vs Closed / Breakdown charts (summary) ── */
export const mockOpenVsClosedTrend: TrendPoint[] = Array.from({ length: 14 }).map((_, i) => {
  const closed = Math.floor(Math.random() * 40) + 20;
  const open   = Math.floor(Math.random() * 15) + 3;
  return {
    date: new Date(Date.now() - (13 - i) * 86400000).toISOString().split('T')[0].substring(5),
    value: open, closed, open,
  };
});

export const mockBreakdownVsNonBreakdown: TrendPoint[] = [
  { date: 'Breakdown',         value: 12 },
  { date: 'Non-BD High',       value: 28 },
  { date: 'Non-BD Low',        value: 47 },
];

/* ── Technicians ────────────────────────────────── */
export const mockTechnicians: Technician[] = [
  { id: '1',  name: 'Budi Santoso',    team: 'Electrical',      completionRate: 95, avgResponseTime: 0.5, avgRepairTime: 1.2, totalWO: 145, shift: 'Morning' },
  { id: '2',  name: 'Agus Pratama',    team: 'Mechanical',      completionRate: 92, avgResponseTime: 0.8, avgRepairTime: 1.5, totalWO: 132, shift: 'Morning' },
  { id: '3',  name: 'Hendra Wijaya',   team: 'Instrumentation', completionRate: 88, avgResponseTime: 1.0, avgRepairTime: 1.8, totalWO: 118, shift: 'Afternoon' },
  { id: '4',  name: 'Rizky Fadillah',  team: 'Electrical',      completionRate: 85, avgResponseTime: 1.2, avgRepairTime: 2.1, totalWO: 105, shift: 'Afternoon' },
  { id: '5',  name: 'Dedi Kurniawan',  team: 'Mechanical',      completionRate: 82, avgResponseTime: 1.5, avgRepairTime: 2.5, totalWO: 98,  shift: 'Night' },
  { id: '6',  name: 'Sandi Maulana',   team: 'Civil',           completionRate: 79, avgResponseTime: 1.7, avgRepairTime: 2.8, totalWO: 87,  shift: 'Morning' },
  { id: '7',  name: 'Fajar Nugroho',   team: 'Instrumentation', completionRate: 76, avgResponseTime: 2.0, avgRepairTime: 3.1, totalWO: 74,  shift: 'Afternoon' },
  { id: '8',  name: 'Irfan Hakim',     team: 'Mechanical',      completionRate: 74, avgResponseTime: 2.2, avgRepairTime: 3.4, totalWO: 68,  shift: 'Night' },
  { id: '9',  name: 'Wahyu Prasetyo',  team: 'Electrical',      completionRate: 71, avgResponseTime: 2.5, avgRepairTime: 3.8, totalWO: 61,  shift: 'Night' },
  { id: '10', name: 'Eko Sulistyo',    team: 'Civil',           completionRate: 68, avgResponseTime: 2.8, avgRepairTime: 4.2, totalWO: 55,  shift: 'Morning' },
];

/* ── Team Performance ───────────────────────────── */
export const mockTeamPerformance: TeamPerformanceSummary[] = [
  { id: '1', team: 'Electrical',      leader: 'Budi Santoso',   members: 8,  completionRate: 93, avgResponseTime: 0.7, avgRepairTime: 1.6, totalWO: 310, breakdown: 3,  otHours: 48 },
  { id: '2', team: 'Mechanical',      leader: 'Agus Pratama',   members: 10, completionRate: 88, avgResponseTime: 1.0, avgRepairTime: 2.0, totalWO: 298, breakdown: 5,  otHours: 62 },
  { id: '3', team: 'Instrumentation', leader: 'Hendra Wijaya',  members: 6,  completionRate: 85, avgResponseTime: 1.1, avgRepairTime: 2.1, totalWO: 192, breakdown: 2,  otHours: 35 },
  { id: '4', team: 'Civil',           leader: 'Sandi Maulana',  members: 5,  completionRate: 78, avgResponseTime: 1.8, avgRepairTime: 3.0, totalWO: 142, breakdown: 2,  otHours: 28 },
];

/* ── Attendance ─────────────────────────────────── */
export const mockAttendanceSummary: AttendanceSummary = {
  present: 98, absent: 4, sick: 5, leave: 7, late: 12,
  total: 114, presentPct: 85.9,
};

export const mockAttendanceTrend: AttendanceTrend[] = Array.from({ length: 14 }).map((_, i) => {
  const present  = Math.floor(Math.random() * 10) + 90;
  const absent   = Math.floor(Math.random() * 5)  + 1;
  const sick     = Math.floor(Math.random() * 5)  + 1;
  const leave    = Math.floor(Math.random() * 8)  + 2;
  const late     = Math.floor(Math.random() * 10) + 3;
  const overtime = Math.floor(Math.random() * 20) + 10;
  return {
    date: new Date(Date.now() - (13 - i) * 86400000).toISOString().split('T')[0].substring(5),
    present, absent, sick, leave, late, overtime,
  };
});

const statuses: AttendanceRecord['status'][] = ['PRESENT', 'PRESENT', 'PRESENT', 'LATE', 'ABSENT', 'SICK', 'LEAVE'];
const shifts = ['Morning', 'Afternoon', 'Night'];
const teams  = ['Electrical', 'Mechanical', 'Instrumentation', 'Civil'];

export const mockAttendanceRecords: AttendanceRecord[] = mockTechnicians.flatMap((tech, ti) =>
  Array.from({ length: 7 }).map((_, di) => {
    const status = statuses[(ti + di) % statuses.length];
    return {
      id: `ATT-${ti}-${di}`,
      employeeId: `EMP-${String(ti + 1).padStart(3, '0')}`,
      name: tech.name,
      team: tech.team,
      shift: shifts[ti % shifts.length],
      date: new Date(Date.now() - (6 - di) * 86400000).toISOString().split('T')[0],
      checkIn:  status === 'ABSENT' ? '-' : status === 'LATE' ? '08:22' : '07:55',
      checkOut: status === 'ABSENT' ? '-' : '17:00',
      status,
      otHours: status === 'PRESENT' && di % 3 === 0 ? Math.floor(Math.random() * 3) + 1 : 0,
    };
  })
);

/* ── Overtime ───────────────────────────────────── */
export const mockOvertimeSummary: OvertimeSummary = {
  totalHours: 173,
  employeesOnOT: 29,
  avgHoursPerEmployee: 5.97,
  byShift: [
    { shift: 'Morning',   hours: 68,  employees: 12 },
    { shift: 'Afternoon', hours: 55,  employees: 10 },
    { shift: 'Night',     hours: 50,  employees: 7  },
  ],
  byTeam: [
    { team: 'Electrical',      hours: 48, employees: 8  },
    { team: 'Mechanical',      hours: 62, employees: 10 },
    { team: 'Instrumentation', hours: 35, employees: 6  },
    { team: 'Civil',           hours: 28, employees: 5  },
  ],
  trend: Array.from({ length: 14 }).map((_, i) => ({
    date: new Date(Date.now() - (13 - i) * 86400000).toISOString().split('T')[0].substring(5),
    hours:     Math.floor(Math.random() * 20) + 8,
    employees: Math.floor(Math.random() * 10) + 5,
  })),
};

export const mockOvertimeRecords: OvertimeRecord[] = mockTechnicians.flatMap((tech, ti) =>
  Array.from({ length: 3 }).map((_, di) => ({
    id: `OT-${ti}-${di}`,
    employeeId: `EMP-${String(ti + 1).padStart(3, '0')}`,
    name: tech.name,
    team: tech.team,
    shift: shifts[ti % shifts.length],
    date: new Date(Date.now() - (di * 2) * 86400000).toISOString().split('T')[0],
    hours: Math.floor(Math.random() * 3) + 1,
    reason: ['Emergency Repair', 'Scheduled Maintenance', 'Production Demand', 'Project Deadline'][di % 4],
    approvedBy: 'Ir. Susanto (Maintenance Manager)',
  }))
);

/* ── Work Orders ────────────────────────────────── */
const priorities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const;
const statuses2  = ['OPEN', 'IN PROGRESS', 'WAITING PARTS', 'WAITING VENDOR', 'ON HOLD', 'CLOSED'] as const;
const areas      = ['Packaging', 'Processing', 'Utilities', 'Finishing', 'QC'];
const categories = ['Corrective', 'Preventive', 'Predictive', 'Improvement'];
const machines   = [
  'Packer A', 'Packer B', 'Boiler 1', 'Boiler 2', 'Mixer A', 'Mixer B',
  'Conveyor 1', 'Conveyor 2', 'Conveyor 3', 'Wrapper A', 'Wrapper C',
  'Pump 1', 'Pump 2', 'Compressor 1', 'Dryer A', 'Dryer B', 'CNC Machine 1',
  'Filling Line A', 'Filling Line B', 'Sealer 1',
];
const descriptions = [
  'Periodic lubrication and inspection of moving parts',
  'Replace worn-out bearing assembly',
  'Calibration of pressure sensor',
  'Electrical fault investigation and repair',
  'Belt tension adjustment and alignment check',
  'Motor replacement and alignment',
  'Hydraulic seal replacement',
  'PLC software update and parameter reset',
  'Vibration analysis and balancing',
  'Emergency repair — production stoppage',
];

export const mockWorkOrders: WorkOrder[] = Array.from({ length: 60 }).map((_, i) => {
  const status    = statuses2[i % statuses2.length];
  const priority  = priorities[i % priorities.length];
  const isBreakdown = i % 5 === 0 || priority === 'CRITICAL';
  return {
    id: `WO-${1000 + i}`,
    woNumber: `WO-${1000 + i}`,
    machine:  machines[i % machines.length],
    area:     areas[i % areas.length],
    category: categories[i % categories.length],
    priority,
    status,
    openedDate:   new Date(Date.now() - Math.floor(Math.random() * 14) * 86400000).toISOString(),
    durationHours: Math.floor(Math.random() * 72) + 1,
    pic:   mockTechnicians[i % mockTechnicians.length].name,
    team:  teams[i % teams.length],
    shift: shifts[i % shifts.length],
    description: descriptions[i % descriptions.length],
    isBreakdown,
    breakdownLevel: isBreakdown ? (priority === 'CRITICAL' ? 'HIGH' : 'LOW') : null,
  };
});

/* ── Longest open WOs (top 5 by duration) ───────── */
export const mockLongestOpenWOs: WorkOrder[] = [...mockWorkOrders]
  .filter(wo => wo.status !== 'CLOSED')
  .sort((a, b) => b.durationHours - a.durationHours)
  .slice(0, 8);

/* ── PM Items ───────────────────────────────────── */
export const mockPMItems: PMItem[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `PM-${100 + i}`,
  machine:    machines[i % machines.length],
  area:       areas[i % areas.length],
  lastDone:   new Date(Date.now() - (30 + i * 2) * 86400000).toISOString(),
  nextDue:    new Date(Date.now() + (i - 4) * 3 * 86400000).toISOString(),
  technician: mockTechnicians[i % mockTechnicians.length].name,
  status:     i < 4 ? 'overdue' : i < 9 ? 'due' : 'upcoming',
}));

/* ── Alarms ─────────────────────────────────────── */
export const mockAlarms: AlarmItem[] = [
  { id: '1', woNumber: 'WO-1001', machine: 'Packer A',     area: 'Packaging',  duration: 4.5,  type: 'critical', priority: 'CRITICAL', team: 'Mechanical' },
  { id: '2', woNumber: 'WO-1005', machine: 'Boiler 1',     area: 'Utilities',  duration: 2.1,  type: 'critical', priority: 'CRITICAL', team: 'Electrical' },
  { id: '3', woNumber: 'WO-1012', machine: 'Mixer B',      area: 'Processing', duration: 48,   type: 'parts',    priority: 'HIGH',     team: 'Mechanical' },
  { id: '4', woNumber: 'WO-1018', machine: 'Conveyor 3',   area: 'Packaging',  duration: 72,   type: 'vendor',   priority: 'HIGH',     team: 'Civil' },
  { id: '5', woNumber: 'WO-1022', machine: 'Wrapper C',    area: 'Packaging',  duration: 120,  type: 'late',     priority: 'HIGH',     team: 'Mechanical' },
  { id: '6', woNumber: 'WO-1031', machine: 'Pump 2',       area: 'Utilities',  duration: 8.5,  type: 'critical', priority: 'CRITICAL', team: 'Electrical' },
  { id: '7', woNumber: 'WO-1044', machine: 'Compressor 1', area: 'Utilities',  duration: 96,   type: 'parts',    priority: 'HIGH',     team: 'Instrumentation' },
];

/* ── Utility ────────────────────────────────────── */
export const mockUtilityData: UtilityData = {
  steam:       { current: 15.4, trend: [13.8, 14.2, 14.9, 15.1, 15.4], status: 'NORMAL' },
  boiler: {
    pressure:    { current: 8.5, trend: [8.0, 8.2, 8.4, 8.6, 8.5], status: 'NORMAL' },
    temperature: { current: 145, trend: [140, 142, 144, 146, 145], status: 'WARNING' },
    status: 'WARNING',
  },
  power:       { current: 2450, trend: [2300, 2400, 2500, 2480, 2450], peak: 2800, offPeak: 1800, status: 'NORMAL' },
  compressedAir:{ current: 6.8, trend: [6.5, 6.7, 6.9, 7.0, 6.8], status: 'NORMAL' },
  water:       { current: 1200, trend: [1100, 1150, 1250, 1220, 1200], status: 'NORMAL' },
};

/* ── Executive summary chart: OT vs Breakdown ───── */
export const mockOTvsBreakdown: TrendPoint[] = Array.from({ length: 14 }).map((_, i) => ({
  date:      new Date(Date.now() - (13 - i) * 86400000).toISOString().split('T')[0].substring(5),
  value:     Math.floor(Math.random() * 3) + 1,
  overtime:  Math.floor(Math.random() * 15) + 5,
}));

/* ── Assets ─────────────────────────────────────── */
export interface Asset {
  id: string; tag: string; name: string; area: string; type: string;
  manufacturer: string; year: number; lastService: string;
  status: 'Operational' | 'Under Maintenance' | 'Offline';
}

export const mockAssets: Asset[] = [
  { id: 'A001', tag: 'TCO-PKG-001', name: 'Packer A',       area: 'Packaging',  type: 'Packing Machine',    manufacturer: 'ROVEMA',        year: 2018, lastService: '2026-05-10', status: 'Operational' },
  { id: 'A002', tag: 'TCO-PKG-002', name: 'Packer B',       area: 'Packaging',  type: 'Packing Machine',    manufacturer: 'ROVEMA',        year: 2019, lastService: '2026-06-01', status: 'Operational' },
  { id: 'A003', tag: 'TCO-PKG-003', name: 'Wrapper A',      area: 'Packaging',  type: 'Wrapping Machine',   manufacturer: 'Fuji Machinery',year: 2017, lastService: '2026-04-20', status: 'Under Maintenance' },
  { id: 'A004', tag: 'TCO-PKG-004', name: 'Wrapper C',      area: 'Packaging',  type: 'Wrapping Machine',   manufacturer: 'Fuji Machinery',year: 2020, lastService: '2026-05-28', status: 'Operational' },
  { id: 'A005', tag: 'TCO-PKG-005', name: 'Conveyor 1',     area: 'Packaging',  type: 'Conveyor',           manufacturer: 'Interroll',     year: 2016, lastService: '2026-03-15', status: 'Operational' },
  { id: 'A006', tag: 'TCO-PKG-006', name: 'Conveyor 2',     area: 'Packaging',  type: 'Conveyor',           manufacturer: 'Interroll',     year: 2016, lastService: '2026-06-10', status: 'Operational' },
  { id: 'A007', tag: 'TCO-PKG-007', name: 'Conveyor 3',     area: 'Packaging',  type: 'Conveyor',           manufacturer: 'Interroll',     year: 2018, lastService: '2026-05-05', status: 'Under Maintenance' },
  { id: 'A008', tag: 'TCO-PKG-008', name: 'Sealer 1',       area: 'Packaging',  type: 'Heat Sealer',        manufacturer: 'Audion',        year: 2021, lastService: '2026-06-20', status: 'Operational' },
  { id: 'A009', tag: 'TCO-PRC-001', name: 'Mixer A',        area: 'Processing', type: 'Industrial Mixer',   manufacturer: 'Silverson',     year: 2015, lastService: '2026-04-01', status: 'Operational' },
  { id: 'A010', tag: 'TCO-PRC-002', name: 'Mixer B',        area: 'Processing', type: 'Industrial Mixer',   manufacturer: 'Silverson',     year: 2017, lastService: '2026-05-22', status: 'Under Maintenance' },
  { id: 'A011', tag: 'TCO-PRC-003', name: 'Filling Line A', area: 'Processing', type: 'Filling Machine',    manufacturer: 'Tetra Pak',     year: 2019, lastService: '2026-06-15', status: 'Operational' },
  { id: 'A012', tag: 'TCO-PRC-004', name: 'Filling Line B', area: 'Processing', type: 'Filling Machine',    manufacturer: 'Tetra Pak',     year: 2020, lastService: '2026-06-18', status: 'Operational' },
  { id: 'A013', tag: 'TCO-PRC-005', name: 'CNC Machine 1',  area: 'Processing', type: 'CNC Machining Center',manufacturer: 'Fanuc',        year: 2022, lastService: '2026-06-01', status: 'Operational' },
  { id: 'A014', tag: 'TCO-UTL-001', name: 'Boiler 1',       area: 'Utilities',  type: 'Steam Boiler',       manufacturer: 'Cleaver-Brooks',year: 2014, lastService: '2026-03-01', status: 'Operational' },
  { id: 'A015', tag: 'TCO-UTL-002', name: 'Boiler 2',       area: 'Utilities',  type: 'Steam Boiler',       manufacturer: 'Cleaver-Brooks',year: 2016, lastService: '2026-04-10', status: 'Offline' },
  { id: 'A016', tag: 'TCO-UTL-003', name: 'Compressor 1',   area: 'Utilities',  type: 'Air Compressor',     manufacturer: 'Atlas Copco',   year: 2018, lastService: '2026-05-30', status: 'Operational' },
  { id: 'A017', tag: 'TCO-UTL-004', name: 'Pump 1',         area: 'Utilities',  type: 'Centrifugal Pump',   manufacturer: 'Grundfos',      year: 2017, lastService: '2026-06-05', status: 'Operational' },
  { id: 'A018', tag: 'TCO-UTL-005', name: 'Pump 2',         area: 'Utilities',  type: 'Centrifugal Pump',   manufacturer: 'Grundfos',      year: 2019, lastService: '2026-05-12', status: 'Under Maintenance' },
  { id: 'A019', tag: 'TCO-FIN-001', name: 'Dryer A',        area: 'Finishing',  type: 'Industrial Dryer',   manufacturer: 'Stalam',        year: 2016, lastService: '2026-04-25', status: 'Operational' },
  { id: 'A020', tag: 'TCO-FIN-002', name: 'Dryer B',        area: 'Finishing',  type: 'Industrial Dryer',   manufacturer: 'Stalam',        year: 2018, lastService: '2026-06-12', status: 'Operational' },
  { id: 'A021', tag: 'TCO-QC-001',  name: 'Vision System 1',area: 'QC',         type: 'Machine Vision',     manufacturer: 'Cognex',        year: 2021, lastService: '2026-06-22', status: 'Operational' },
  { id: 'A022', tag: 'TCO-QC-002',  name: 'Weight Checker', area: 'QC',         type: 'Checkweigher',       manufacturer: 'Mettler Toledo',year: 2020, lastService: '2026-06-08', status: 'Operational' },
];
