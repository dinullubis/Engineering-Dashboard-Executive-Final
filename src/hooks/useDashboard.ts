import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';
import { FilterState } from '../types';

const DEFAULT_FILTERS: FilterState = {
  period:     'Today',
  area:       'All',
  machine:    'All',
  category:   'All',
  shift:      'All',
  team:       'All',
  employee:   'All',
  woStatus:   'All',
  woCategory: 'All',
};

export const useDashboard = () => {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const updateFilters = useCallback((partial: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...partial }));
  }, []);

  /* ── Engineering KPI ─────────────────────────── */
  const summaryQ         = useQuery({ queryKey: ['summary',         filters], queryFn: () => dashboardService.getSummary(filters) });
  const dailyTrendQ      = useQuery({ queryKey: ['dailyTrend',      filters], queryFn: () => dashboardService.getDailyTrend(filters) });
  const weeklyTrendQ     = useQuery({ queryKey: ['weeklyTrend',     filters], queryFn: () => dashboardService.getWeeklyTrend(filters) });
  const monthlyTrendQ    = useQuery({ queryKey: ['monthlyTrend',    filters], queryFn: () => dashboardService.getMonthlyTrend(filters) });
  const breakdownAreaQ   = useQuery({ queryKey: ['breakdownArea',   filters], queryFn: () => dashboardService.getBreakdownArea(filters) });
  const breakdownMachineQ= useQuery({ queryKey: ['breakdownMachine',filters], queryFn: () => dashboardService.getBreakdownMachine(filters) });
  const downtimeQ        = useQuery({ queryKey: ['downtime',        filters], queryFn: () => dashboardService.getDowntime(filters) });
  const woCategoryQ      = useQuery({ queryKey: ['woCategory',      filters], queryFn: () => dashboardService.getWOCategory(filters) });
  const woStatusQ        = useQuery({ queryKey: ['woStatus',        filters], queryFn: () => dashboardService.getWOStatus(filters) });
  const mttrTrendQ       = useQuery({ queryKey: ['mttrTrend',       filters], queryFn: () => dashboardService.getMTTRTrend(filters) });
  const mtbfTrendQ       = useQuery({ queryKey: ['mtbfTrend',       filters], queryFn: () => dashboardService.getMTBFTrend(filters) });
  const topEngineerQ     = useQuery({ queryKey: ['topEngineer',     filters], queryFn: () => dashboardService.getTopEngineer(filters) });
  const utilityQ         = useQuery({ queryKey: ['utility',         filters], queryFn: () => dashboardService.getUtility(filters) });
  const openWOQ          = useQuery({ queryKey: ['openWO',          filters], queryFn: () => dashboardService.getOpenWO(filters) });
  const alarmQ           = useQuery({ queryKey: ['alarm',           filters], queryFn: () => dashboardService.getAlarm(filters) });
  const pmQ              = useQuery({ queryKey: ['pm',              filters], queryFn: () => dashboardService.getPM(filters) });

  /* ── New data ────────────────────────────────── */
  const woExtQ           = useQuery({ queryKey: ['woExt',           filters], queryFn: () => dashboardService.getWOSummaryExtended(filters) });
  const attendanceSumQ   = useQuery({ queryKey: ['attendanceSum',   filters], queryFn: () => dashboardService.getAttendanceSummary(filters) });
  const attendanceTrendQ = useQuery({ queryKey: ['attendanceTrend', filters], queryFn: () => dashboardService.getAttendanceTrend(filters) });
  const attendanceRecQ   = useQuery({ queryKey: ['attendanceRec',   filters], queryFn: () => dashboardService.getAttendanceRecords(filters) });
  const overtimeSumQ     = useQuery({ queryKey: ['overtimeSum',     filters], queryFn: () => dashboardService.getOvertimeSummary(filters) });
  const overtimeRecQ     = useQuery({ queryKey: ['overtimeRec',     filters], queryFn: () => dashboardService.getOvertimeRecords(filters) });
  const teamPerfQ        = useQuery({ queryKey: ['teamPerf',        filters], queryFn: () => dashboardService.getTeamPerformance(filters) });
  const openVsClosedQ    = useQuery({ queryKey: ['openVsClosed',    filters], queryFn: () => dashboardService.getOpenVsClosedTrend(filters) });
  const otVsBdQ          = useQuery({ queryKey: ['otVsBd',          filters], queryFn: () => dashboardService.getOTvsBreakdown(filters) });
  const bdVsNonBdQ       = useQuery({ queryKey: ['bdVsNonBd',       filters], queryFn: () => dashboardService.getBreakdownVsNonBreakdown(filters) });
  const longestWOQ       = useQuery({ queryKey: ['longestWO',       filters], queryFn: () => dashboardService.getLongestOpenWOs(filters) });

  const allQueries = [
    summaryQ, dailyTrendQ, weeklyTrendQ, monthlyTrendQ, breakdownAreaQ,
    breakdownMachineQ, downtimeQ, woCategoryQ, woStatusQ, mttrTrendQ,
    mtbfTrendQ, topEngineerQ, utilityQ, openWOQ, alarmQ, pmQ,
    woExtQ, attendanceSumQ, attendanceTrendQ, attendanceRecQ,
    overtimeSumQ, overtimeRecQ, teamPerfQ, openVsClosedQ, otVsBdQ,
    bdVsNonBdQ, longestWOQ,
  ];

  const isLoading = allQueries.some(q => q.isLoading);
  const isError   = allQueries.some(q => q.isError);

  const refetchAll = useCallback(() => {
    allQueries.forEach(q => q.refetch());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return {
    filters,
    updateFilters,
    isLoading,
    isError,
    refetchAll,
    data: {
      summary:            summaryQ.data,
      dailyTrend:         dailyTrendQ.data,
      weeklyTrend:        weeklyTrendQ.data,
      monthlyTrend:       monthlyTrendQ.data,
      breakdownArea:      breakdownAreaQ.data,
      breakdownMachine:   breakdownMachineQ.data,
      downtime:           downtimeQ.data,
      woCategory:         woCategoryQ.data,
      woStatus:           woStatusQ.data,
      mttrTrend:          mttrTrendQ.data,
      mtbfTrend:          mtbfTrendQ.data,
      topEngineer:        topEngineerQ.data,
      utility:            utilityQ.data,
      openWO:             openWOQ.data,
      alarm:              alarmQ.data,
      pm:                 pmQ.data,
      woExt:              woExtQ.data,
      attendanceSummary:  attendanceSumQ.data,
      attendanceTrend:    attendanceTrendQ.data,
      attendanceRecords:  attendanceRecQ.data,
      overtimeSummary:    overtimeSumQ.data,
      overtimeRecords:    overtimeRecQ.data,
      teamPerformance:    teamPerfQ.data,
      openVsClosed:       openVsClosedQ.data,
      otVsBreakdown:      otVsBdQ.data,
      bdVsNonBd:          bdVsNonBdQ.data,
      longestOpenWOs:     longestWOQ.data,
    },
  };
};
