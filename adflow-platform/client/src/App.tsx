import { useState } from 'react';
import { Router, Route, Switch } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from '@/lib/queryClient';

// Pages
import Landing from '@/pages/landing';
import Dashboard from '@/pages/dashboard';
import Campaigns from '@/pages/campaigns';
import Analytics from '@/pages/analytics';
import Accounts from '@/pages/accounts';
import Team from '@/pages/team';
import Billing from '@/pages/billing';
import Subscribe from '@/pages/subscribe';
import NotFound from '@/pages/not-found';

// Components
import Header from '@/components/layout/header';
import Sidebar from './components/layout/sidebar';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="flex h-screen">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <div className="flex-1 flex flex-col">
        <Header onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-background">
            <Switch>
              <Route path="/" component={Landing} />
              <Route path="/dashboard">
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </Route>
              <Route path="/campaigns">
                <DashboardLayout>
                  <Campaigns />
                </DashboardLayout>
              </Route>
              <Route path="/analytics">
                <DashboardLayout>
                  <Analytics />
                </DashboardLayout>
              </Route>
              <Route path="/accounts">
                <DashboardLayout>
                  <Accounts />
                </DashboardLayout>
              </Route>
              <Route path="/team">
                <DashboardLayout>
                  <Team />
                </DashboardLayout>
              </Route>
              <Route path="/billing">
                <DashboardLayout>
                  <Billing />
                </DashboardLayout>
              </Route>
              <Route path="/subscribe" component={Subscribe} />
              <Route component={NotFound} />
            </Switch>
          </div>
          <Toaster />
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}