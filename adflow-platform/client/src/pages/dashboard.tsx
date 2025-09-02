
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Eye, 
  MousePointer, 
  Users,
  Calendar,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { SiGoogle, SiFacebook, SiInstagram, SiYoutube } from 'react-icons/si';

const mockData = {
  overview: {
    totalSpend: 45672.33,
    totalImpressions: 2847592,
    totalClicks: 18394,
    totalConversions: 1247,
    ctr: 0.65,
    roas: 4.2
  },
  dailySpend: [
    { date: 'Mon', spend: 1200, conversions: 45 },
    { date: 'Tue', spend: 1450, conversions: 52 },
    { date: 'Wed', spend: 1100, conversions: 38 },
    { date: 'Thu', spend: 1680, conversions: 61 },
    { date: 'Fri', spend: 1920, conversions: 74 },
    { date: 'Sat', spend: 1150, conversions: 41 },
    { date: 'Sun', spend: 980, conversions: 35 }
  ],
  platformData: [
    { name: 'Google Ads', value: 45, color: '#4285F4' },
    { name: 'Facebook', value: 30, color: '#1877F2' },
    { name: 'Instagram', value: 20, color: '#E4405F' },
    { name: 'YouTube', value: 5, color: '#FF0000' }
  ],
  activeCampaigns: [
    {
      id: '1',
      name: 'Summer Sale Campaign',
      platform: 'google',
      status: 'active',
      budget: 500,
      spent: 342.50,
      impressions: 45672,
      clicks: 892,
      conversions: 23
    },
    {
      id: '2',
      name: 'Brand Awareness Push',
      platform: 'facebook',
      status: 'active',
      budget: 300,
      spent: 198.30,
      impressions: 28394,
      clicks: 567,
      conversions: 15
    },
    {
      id: '3',
      name: 'Product Launch',
      platform: 'instagram',
      status: 'paused',
      budget: 750,
      spent: 456.80,
      impressions: 67231,
      clicks: 1243,
      conversions: 41
    }
  ]
};

const platformIcons = {
  google: SiGoogle,
  facebook: SiFacebook,
  instagram: SiInstagram,
  youtube: SiYoutube
};

export default function Dashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');

  const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 gradient-primary opacity-5" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold gradient-text">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          {trend === 'up' ? (
            <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
          ) : (
            <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
          )}
          <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
            {change}
          </span>
          <span className="ml-1">from last period</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your campaigns.
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 lg:mt-0">
          <Button
            variant={selectedTimeframe === '7d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeframe('7d')}
            className={selectedTimeframe === '7d' ? 'gradient-primary text-white' : ''}
          >
            7 Days
          </Button>
          <Button
            variant={selectedTimeframe === '30d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeframe('30d')}
            className={selectedTimeframe === '30d' ? 'gradient-primary text-white' : ''}
          >
            30 Days
          </Button>
          <Button
            variant={selectedTimeframe === '90d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeframe('90d')}
            className={selectedTimeframe === '90d' ? 'gradient-primary text-white' : ''}
          >
            90 Days
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Spend"
          value={`$${mockData.overview.totalSpend.toLocaleString()}`}
          change="+12.5%"
          icon={DollarSign}
          trend="up"
        />
        <StatCard
          title="Impressions"
          value={mockData.overview.totalImpressions.toLocaleString()}
          change="+8.2%"
          icon={Eye}
          trend="up"
        />
        <StatCard
          title="Clicks"
          value={mockData.overview.totalClicks.toLocaleString()}
          change="+15.3%"
          icon={MousePointer}
          trend="up"
        />
        <StatCard
          title="Conversions"
          value={mockData.overview.totalConversions.toLocaleString()}
          change="-2.1%"
          icon={Target}
          trend="down"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Daily Performance
            </CardTitle>
            <CardDescription>
              Spend and conversions over the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockData.dailySpend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="spend" fill="url(#gradient)" />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4776bd" />
                    <stop offset="100%" stopColor="#e84a6c" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Platform Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Platform Distribution
            </CardTitle>
            <CardDescription>
              Campaign spend by platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockData.platformData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {mockData.platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Active Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Active Campaigns
          </CardTitle>
          <CardDescription>
            Your currently running campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.activeCampaigns.map((campaign) => {
              const IconComponent = platformIcons[campaign.platform as keyof typeof platformIcons];
              const progressPercentage = (campaign.spent / campaign.budget) * 100;
              
              return (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{campaign.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge
                          variant={campaign.status === 'active' ? 'default' : 'secondary'}
                          className={campaign.status === 'active' ? 'gradient-primary text-white' : ''}
                        >
                          {campaign.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground capitalize">
                          {campaign.platform}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        ${campaign.spent} / ${campaign.budget}
                      </p>
                      <Progress 
                        value={progressPercentage} 
                        className="w-20 mt-1"
                      />
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Impressions</p>
                      <p className="font-semibold">{campaign.impressions.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Clicks</p>
                      <p className="font-semibold">{campaign.clicks.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Conversions</p>
                      <p className="font-semibold">{campaign.conversions}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
