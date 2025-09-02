import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from "recharts";
import { TrendingUp, Download, Filter } from "lucide-react";

const mockConversionData = [
  { name: 'Impressions', value: 2400000, percentage: 100 },
  { name: 'Clicks', value: 76800, percentage: 32 },
  { name: 'Conversions', value: 2300, percentage: 3 },
];

const mockPlatformData = [
  { name: 'Google Ads', value: 45, color: 'hsl(200, 76%, 66%)' },
  { name: 'Facebook', value: 35, color: 'hsl(220, 76%, 66%)' },
  { name: 'Instagram', value: 20, color: 'hsl(280, 76%, 66%)' },
];

const mockPerformanceData = [
  { name: 'Week 1', revenue: 12000, spend: 3000, roas: 4.0 },
  { name: 'Week 2', revenue: 15000, spend: 3500, roas: 4.3 },
  { name: 'Week 3', revenue: 18000, spend: 4000, roas: 4.5 },
  { name: 'Week 4', revenue: 22000, spend: 4500, roas: 4.9 },
];

export default function Analytics() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  const { data: campaigns, error: campaignError } = useQuery({
    queryKey: ["/api/campaigns"],
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
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <Header 
          title="Analytics & Insights"
          subtitle="Detailed performance insights and campaign analytics"
          actions={
            <Button variant="outline" className="border-primary/50 hover:bg-primary/10" data-testid="button-generate-report">
              <Download className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          }
        />

        {/* Analytics Filters */}
        <Card className="glass-effect border-border/50 mb-8 animate-slide-in">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <Select defaultValue="7d">
                <SelectTrigger className="w-40 bg-input border-border" data-testid="select-date-range">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
              
              <Select defaultValue="all">
                <SelectTrigger className="w-48 bg-input border-border" data-testid="select-platform">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="google">Google Ads</SelectItem>
                  <SelectItem value="facebook">Facebook Ads</SelectItem>
                  <SelectItem value="instagram">Instagram Ads</SelectItem>
                  <SelectItem value="youtube">YouTube Ads</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="border-primary/50 hover:bg-primary/10" data-testid="button-apply-filters">
                <Filter className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-effect border-border/50 animate-slide-in">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Conversion Funnel</h3>
              <div className="space-y-4">
                {mockConversionData.map((item, index) => (
                  <div key={item.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                      <span className="font-medium text-foreground" data-testid={`text-${item.name.toLowerCase()}`}>
                        {item.value.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={item.percentage} className="h-2 bg-muted" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-border/50 animate-slide-in">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Platform Performance</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockPlatformData}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      dataKey="value"
                    >
                      {mockPlatformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {mockPlatformData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-foreground">{item.name}</span>
                    </div>
                    <span className="font-medium text-foreground" data-testid={`text-platform-${item.name.toLowerCase().replace(' ', '-')}`}>
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-border/50 animate-slide-in">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Top Performing Campaigns</h3>
              <div className="space-y-3">
                {Array.isArray(campaigns) ? campaigns.slice(0, 3).map((campaign: any, index: number) => (
                  <div key={campaign.id} className="p-3 bg-secondary/30 rounded-lg">
                    <p className="font-medium text-foreground text-sm" data-testid={`text-top-campaign-${index}`}>
                      {campaign.name}
                    </p>
                    <p className="text-xs text-green-400">+{Math.floor(Math.random() * 30 + 10)}% conversion rate</p>
                  </div>
                )) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground text-sm">No campaign data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="glass-effect border-border/50 animate-slide-in">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Revenue vs Spend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(252, 15%, 22%)" />
                    <XAxis dataKey="name" stroke="hsl(252, 8%, 65%)" />
                    <YAxis stroke="hsl(252, 8%, 65%)" />
                    <Bar dataKey="revenue" fill="hsl(258, 76%, 66%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="spend" fill="hsl(285, 76%, 66%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-border/50 animate-slide-in">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">ROAS Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(252, 15%, 22%)" />
                    <XAxis dataKey="name" stroke="hsl(252, 8%, 65%)" />
                    <YAxis stroke="hsl(252, 8%, 65%)" />
                    <Line 
                      type="monotone" 
                      dataKey="roas" 
                      stroke="hsl(120, 76%, 66%)" 
                      strokeWidth={3} 
                      dot={{ fill: "hsl(120, 76%, 66%)", strokeWidth: 2, r: 4 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Summary */}
        <Card className="glass-effect border-border/50 animate-slide-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Campaign Performance Summary</h3>
              <Button variant="outline" className="border-primary/50 hover:bg-primary/10" data-testid="button-export-data">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-medium text-foreground">Campaign</th>
                    <th className="text-left p-4 font-medium text-foreground">Platform</th>
                    <th className="text-left p-4 font-medium text-foreground">Impressions</th>
                    <th className="text-left p-4 font-medium text-foreground">Clicks</th>
                    <th className="text-left p-4 font-medium text-foreground">CTR</th>
                    <th className="text-left p-4 font-medium text-foreground">Spend</th>
                    <th className="text-left p-4 font-medium text-foreground">ROAS</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns?.map((campaign: any, index: number) => (
                    <tr key={campaign.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-foreground" data-testid={`text-campaign-name-${index}`}>{campaign.name}</p>
                          <p className="text-sm text-muted-foreground">{campaign.campaignType}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                          {campaign.platform}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-foreground">{Math.floor(Math.random() * 100000 + 10000).toLocaleString()}</td>
                      <td className="p-4 font-medium text-foreground">{Math.floor(Math.random() * 5000 + 500).toLocaleString()}</td>
                      <td className="p-4 font-medium text-foreground">{(Math.random() * 5 + 1).toFixed(1)}%</td>
                      <td className="p-4 font-medium text-foreground">${campaign.dailyBudget || Math.floor(Math.random() * 1000 + 100)}</td>
                      <td className="p-4 font-medium text-green-400">{(Math.random() * 3 + 2).toFixed(1)}x</td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-muted-foreground">
                        No campaign data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
