import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BellRing, DollarSign, Eye, TrendingUp, Plus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts";

const mockChartData = [
  { name: 'Mon', value: 400, revenue: 2400 },
  { name: 'Tue', value: 300, revenue: 1398 },
  { name: 'Wed', value: 200, revenue: 9800 },
  { name: 'Thu', value: 278, revenue: 3908 },
  { name: 'Fri', value: 189, revenue: 4800 },
  { name: 'Sat', value: 239, revenue: 3800 },
  { name: 'Sun', value: 349, revenue: 4300 },
];

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  const { data: campaigns, error: campaignError } = useQuery({
    queryKey: ["/api/campaigns"],
    retry: false,
  });

  const { data: adAccounts, error: accountError } = useQuery({
    queryKey: ["/api/ad-accounts"],
    retry: false,
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  useEffect(() => {
    if (campaignError && isUnauthorizedError(campaignError)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [campaignError, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-effect rounded-xl p-8 animate-fade-in">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = {
    totalCampaigns: Array.isArray(campaigns) ? campaigns.length : 0,
    totalSpend: "$89,234",
    impressions: "2.4M",
    roas: "4.2x"
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <Header 
          title="Dashboard Overview"
          subtitle="Monitor your campaign performance across all platforms"
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-in">
          <Card className="metric-card glass-effect border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Total Campaigns</p>
                  <p className="text-2xl font-bold text-foreground mt-1" data-testid="text-total-campaigns">{stats.totalCampaigns}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                  <BellRing className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <span className="text-green-400 font-medium">+12%</span>
                <span className="text-muted-foreground ml-2">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="metric-card glass-effect border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Total Spend</p>
                  <p className="text-2xl font-bold text-foreground mt-1" data-testid="text-total-spend">{stats.totalSpend}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-accent" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <span className="text-green-400 font-medium">+8%</span>
                <span className="text-muted-foreground ml-2">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="metric-card glass-effect border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Impressions</p>
                  <p className="text-2xl font-bold text-foreground mt-1" data-testid="text-impressions">{stats.impressions}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <span className="text-green-400 font-medium">+24%</span>
                <span className="text-muted-foreground ml-2">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="metric-card glass-effect border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">ROAS</p>
                  <p className="text-2xl font-bold text-foreground mt-1" data-testid="text-roas">{stats.roas}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <span className="text-green-400 font-medium">+5%</span>
                <span className="text-muted-foreground ml-2">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Connected Accounts */}
        <Card className="glass-effect border-border/50 mb-8 animate-slide-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Connected Ad Accounts</h2>
              <Button variant="outline" className="border-primary/50 hover:bg-primary/10" data-testid="button-connect-account">
                <Plus className="w-4 h-4 mr-2" />
                Connect Account
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.isArray(adAccounts) && adAccounts.map((account: any) => (
                <div key={account.id} className="border border-border rounded-lg p-4 hover:border-primary/50 transition-all duration-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{account.platform.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{account.accountName}</p>
                      <Badge variant="secondary" className="text-xs">
                        {account.isConnected ? 'Connected' : 'Disconnected'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
              
              {(!Array.isArray(adAccounts) || adAccounts.length === 0) && (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">No connected accounts yet</p>
                  <Button 
                    className="mt-4 bg-gradient-to-r from-primary to-accent" 
                    onClick={() => window.location.href = "/accounts"}
                    data-testid="button-connect-first-account"
                  >
                    Connect Your First Account
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="glass-effect border-border/50 animate-slide-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Campaign Performance</h3>
                <div className="flex space-x-2">
                  <Button size="sm" variant="default" className="bg-primary/20 text-primary">7D</Button>
                  <Button size="sm" variant="ghost" className="text-muted-foreground">30D</Button>
                  <Button size="sm" variant="ghost" className="text-muted-foreground">90D</Button>
                </div>
              </div>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(252, 15%, 22%)" />
                    <XAxis dataKey="name" stroke="hsl(252, 8%, 65%)" />
                    <YAxis stroke="hsl(252, 8%, 65%)" />
                    <Bar dataKey="value" fill="hsl(258, 76%, 66%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-border/50 animate-slide-in">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Revenue Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(252, 15%, 22%)" />
                    <XAxis dataKey="name" stroke="hsl(252, 8%, 65%)" />
                    <YAxis stroke="hsl(252, 8%, 65%)" />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(285, 76%, 66%)" strokeWidth={3} dot={{ fill: "hsl(285, 76%, 66%)" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Campaigns */}
        <Card className="glass-effect border-border/50 animate-slide-in">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Campaigns</h3>
            <div className="space-y-4">
              {campaigns?.slice(0, 3).map((campaign: any) => (
                <div key={campaign.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div className={`w-2 h-2 rounded-full ${
                      campaign.status === 'active' ? 'bg-green-400' : 
                      campaign.status === 'paused' ? 'bg-yellow-400' : 'bg-red-400'
                    }`} />
                    <div>
                      <p className="font-medium text-foreground" data-testid={`text-campaign-name-${campaign.id}`}>{campaign.name}</p>
                      <p className="text-sm text-muted-foreground">{campaign.platform} • {campaign.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">${campaign.dailyBudget || '0'}</p>
                    <p className="text-sm text-green-400">+12% CTR</p>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No campaigns yet</p>
                  <Button 
                    className="bg-gradient-to-r from-primary to-accent"
                    onClick={() => window.location.href = "/campaigns"}
                    data-testid="button-create-first-campaign"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Campaign
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
