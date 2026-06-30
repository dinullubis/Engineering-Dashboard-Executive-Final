import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Attendance from "@/pages/Attendance";
import Overtime from "@/pages/Overtime";
import WorkOrders from "@/pages/WorkOrders";
import BreakdownAnalysis from "@/pages/BreakdownAnalysis";
import PreventiveMaintenance from "@/pages/PreventiveMaintenance";
import UtilityMonitoring from "@/pages/UtilityMonitoring";
import TeamPerformance from "@/pages/TeamPerformance";
import Reports from "@/pages/Reports";
import Assets from "@/pages/Assets";
import Settings from "@/pages/Settings";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/"                       component={Dashboard} />
      <Route path="/attendance"             component={Attendance} />
      <Route path="/overtime"               component={Overtime} />
      <Route path="/work-orders"            component={WorkOrders} />
      <Route path="/breakdown"              component={BreakdownAnalysis} />
      <Route path="/preventive-maintenance" component={PreventiveMaintenance} />
      <Route path="/utility"               component={UtilityMonitoring} />
      <Route path="/team"                   component={TeamPerformance} />
      <Route path="/reports"                component={Reports} />
      <Route path="/assets"                 component={Assets} />
      <Route path="/settings"              component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
