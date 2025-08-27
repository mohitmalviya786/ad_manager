# Admin Dashboard Specifications
## Social Media Ad Campaign Management Platform

## Overview
A comprehensive admin dashboard for platform administrators to manage all users, subscriptions, connected accounts, campaigns, and analytics across the entire platform.

---

## 1. Admin Dashboard Features

### 1.1 User Management
- **User Overview**: List all registered users with key metrics
- **User Details**: Individual user profiles with subscription and account info
- **User Actions**: Suspend, activate, upgrade/downgrade subscriptions
- **User Search & Filters**: Search by email, name, subscription plan, status
- **Bulk Operations**: Mass actions for user management

### 1.2 Subscription Management
- **Subscription Overview**: All active, expired, and pending subscriptions
- **Revenue Analytics**: MRR, ARR, churn rate, LTV calculations
- **Billing Management**: Handle failed payments, refunds, upgrades
- **Plan Management**: Create, edit, and manage subscription plans
- **Usage Tracking**: Monitor feature usage across all users

### 1.3 Account Management
- **Connected Accounts**: View all connected ad accounts across platforms
- **Account Health**: Monitor account status, token expiration, sync issues
- **Platform Analytics**: Usage statistics per platform (Google, Facebook, etc.)
- **Account Actions**: Disconnect accounts, refresh tokens, troubleshoot issues

### 1.4 Campaign Analytics
- **Platform-wide Campaigns**: View all campaigns across all users
- **Performance Metrics**: Aggregate performance data across the platform
- **Campaign Health**: Monitor active campaigns, budgets, performance alerts
- **Trend Analysis**: Platform-wide trends and insights

### 1.5 System Analytics
- **Platform Usage**: API calls, feature usage, performance metrics
- **Revenue Analytics**: Subscription revenue, growth trends, churn analysis
- **User Analytics**: User acquisition, retention, engagement metrics
- **Technical Metrics**: System performance, error rates, uptime

---

## 2. Database Schema for Admin Features

```sql
-- Admin Users
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL, -- super_admin, admin, support
  permissions TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Activity Logs
CREATE TABLE admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES admin_users(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50) NOT NULL, -- user, subscription, account, campaign
  resource_id VARCHAR(255),
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Platform Analytics
CREATE TABLE platform_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  total_users INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  total_subscriptions INTEGER DEFAULT 0,
  active_subscriptions INTEGER DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  mrr DECIMAL(10,2) DEFAULT 0,
  churn_rate DECIMAL(5,4) DEFAULT 0,
  total_campaigns INTEGER DEFAULT 0,
  active_campaigns INTEGER DEFAULT 0,
  total_spend DECIMAL(10,2) DEFAULT 0,
  api_calls INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Analytics
CREATE TABLE user_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  login_count INTEGER DEFAULT 0,
  campaigns_created INTEGER DEFAULT 0,
  campaigns_updated INTEGER DEFAULT 0,
  api_calls INTEGER DEFAULT 0,
  features_used TEXT[],
  session_duration INTEGER DEFAULT 0, -- in seconds
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscription Analytics
CREATE TABLE subscription_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status VARCHAR(50) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_status VARCHAR(50),
  usage_metrics JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. Admin API Endpoints

### 3.1 User Management APIs

```typescript
// GET /api/admin/users
interface GetUsersResponse {
  users: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    subscriptionPlan: string;
    subscriptionStatus: string;
    connectedAccountsCount: number;
    campaignsCount: number;
    totalSpend: number;
    lastLoginAt: string;
    createdAt: string;
    isActive: boolean;
  }[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    search?: string;
    subscriptionPlan?: string;
    status?: string;
    dateRange?: {
      start: string;
      end: string;
    };
  };
}

// GET /api/admin/users/:id
interface GetUserDetailsResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    subscription: SubscriptionDetails;
    connectedAccounts: ConnectedAccount[];
    campaigns: Campaign[];
    analytics: UserAnalytics;
    activity: UserActivity[];
  };
}

// PUT /api/admin/users/:id
interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  subscriptionPlan?: string;
  isActive?: boolean;
  notes?: string;
}

// POST /api/admin/users/:id/suspend
interface SuspendUserRequest {
  reason: string;
  duration?: number; // days, null for indefinite
}

// POST /api/admin/users/:id/activate
interface ActivateUserRequest {
  reason: string;
}
```

### 3.2 Subscription Management APIs

```typescript
// GET /api/admin/subscriptions
interface GetSubscriptionsResponse {
  subscriptions: {
    id: string;
    userId: string;
    userEmail: string;
    plan: string;
    status: string;
    amount: number;
    currency: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    nextBillingDate: string;
    paymentStatus: string;
    usageMetrics: {
      campaignsCount: number;
      apiCalls: number;
      featuresUsed: string[];
    };
  }[];
  analytics: {
    totalSubscriptions: number;
    activeSubscriptions: number;
    mrr: number;
    arr: number;
    churnRate: number;
    averageRevenuePerUser: number;
  };
}

// GET /api/admin/subscriptions/analytics
interface SubscriptionAnalyticsResponse {
  revenue: {
    mrr: number;
    arr: number;
    growthRate: number;
    churnRate: number;
  };
  plans: {
    plan: string;
    subscribers: number;
    revenue: number;
    churnRate: number;
  }[];
  trends: {
    date: string;
    mrr: number;
    subscribers: number;
    churnRate: number;
  }[];
}

// POST /api/admin/subscriptions/:id/upgrade
interface UpgradeSubscriptionRequest {
  newPlan: string;
  reason: string;
  effectiveDate?: string;
}

// POST /api/admin/subscriptions/:id/downgrade
interface DowngradeSubscriptionRequest {
  newPlan: string;
  reason: string;
  effectiveDate?: string;
}
```

### 3.3 Account Management APIs

```typescript
// GET /api/admin/accounts
interface GetConnectedAccountsResponse {
  accounts: {
    id: string;
    userId: string;
    userEmail: string;
    platform: string;
    accountName: string;
    accountId: string;
    isActive: boolean;
    lastSyncAt: string;
    tokenExpiresAt: string;
    campaignsCount: number;
    totalSpend: number;
    status: 'healthy' | 'warning' | 'error';
  }[];
  platformBreakdown: {
    platform: string;
    accountsCount: number;
    activeAccounts: number;
    totalSpend: number;
  }[];
}

// GET /api/admin/accounts/analytics
interface AccountAnalyticsResponse {
  totalAccounts: number;
  activeAccounts: number;
  platformDistribution: {
    platform: string;
    accounts: number;
    percentage: number;
  }[];
  healthMetrics: {
    healthy: number;
    warning: number;
    error: number;
  };
  syncIssues: {
    accountId: string;
    platform: string;
    issue: string;
    lastAttempt: string;
  }[];
}

// POST /api/admin/accounts/:id/refresh-token
interface RefreshAccountTokenResponse {
  success: boolean;
  newExpiresAt: string;
}

// POST /api/admin/accounts/:id/disconnect
interface DisconnectAccountRequest {
  reason: string;
}
```

### 3.4 Campaign Analytics APIs

```typescript
// GET /api/admin/campaigns
interface GetPlatformCampaignsResponse {
  campaigns: {
    id: string;
    userId: string;
    userEmail: string;
    name: string;
    platform: string;
    status: string;
    budget: number;
    spend: number;
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    cpc: number;
    roas: number;
    startDate: string;
    endDate: string;
  }[];
  analytics: {
    totalCampaigns: number;
    activeCampaigns: number;
    totalSpend: number;
    totalImpressions: number;
    totalClicks: number;
    averageCtr: number;
    averageCpc: number;
  };
}

// GET /api/admin/campaigns/analytics
interface CampaignAnalyticsResponse {
  performance: {
    totalSpend: number;
    totalImpressions: number;
    totalClicks: number;
    totalConversions: number;
    averageCtr: number;
    averageCpc: number;
    averageRoas: number;
  };
  platformPerformance: {
    platform: string;
    campaigns: number;
    spend: number;
    impressions: number;
    clicks: number;
    ctr: number;
    cpc: number;
  }[];
  trends: {
    date: string;
    spend: number;
    impressions: number;
    clicks: number;
    conversions: number;
  }[];
}
```

### 3.5 System Analytics APIs

```typescript
// GET /api/admin/analytics/overview
interface SystemOverviewResponse {
  users: {
    total: number;
    active: number;
    newThisMonth: number;
    growthRate: number;
  };
  revenue: {
    mrr: number;
    arr: number;
    growthRate: number;
    churnRate: number;
  };
  campaigns: {
    total: number;
    active: number;
    totalSpend: number;
  };
  performance: {
    uptime: number;
    averageResponseTime: number;
    errorRate: number;
    apiCalls: number;
  };
}

// GET /api/admin/analytics/revenue
interface RevenueAnalyticsResponse {
  current: {
    mrr: number;
    arr: number;
    growthRate: number;
  };
  historical: {
    date: string;
    mrr: number;
    subscribers: number;
    churnRate: number;
  }[];
  plans: {
    plan: string;
    subscribers: number;
    revenue: number;
    growthRate: number;
  }[];
  churn: {
    rate: number;
    reasons: {
      reason: string;
      count: number;
      percentage: number;
    }[];
  };
}

// GET /api/admin/analytics/usage
interface UsageAnalyticsResponse {
  apiCalls: {
    total: number;
    byEndpoint: {
      endpoint: string;
      calls: number;
      percentage: number;
    }[];
    byUser: {
      userId: string;
      userEmail: string;
      calls: number;
    }[];
  };
  features: {
    feature: string;
    users: number;
    usageCount: number;
  }[];
  performance: {
    averageResponseTime: number;
    errorRate: number;
    uptime: number;
  };
}
```

---

## 4. Admin Dashboard UI Components

### 4.1 Admin Dashboard Layout

```typescript
// components/admin/AdminLayout.tsx
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminNotifications } from './AdminNotifications';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminHeader />
        <AdminNotifications />
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
```

### 4.2 Admin Dashboard Overview

```typescript
// components/admin/AdminOverview.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, DollarSign, Target, AlertTriangle } from 'lucide-react';

interface AdminOverviewProps {
  data: {
    users: {
      total: number;
      active: number;
      newThisMonth: number;
      growthRate: number;
    };
    revenue: {
      mrr: number;
      arr: number;
      growthRate: number;
      churnRate: number;
    };
    campaigns: {
      total: number;
      active: number;
      totalSpend: number;
    };
    alerts: {
      critical: number;
      warning: number;
    };
  };
}

export function AdminOverview({ data }: AdminOverviewProps) {
  const metrics = [
    {
      name: 'Total Users',
      value: data.users.total.toLocaleString(),
      change: `+${data.users.growthRate}%`,
      changeType: 'positive',
      icon: Users,
    },
    {
      name: 'Monthly Revenue',
      value: `$${data.revenue.mrr.toLocaleString()}`,
      change: `+${data.revenue.growthRate}%`,
      changeType: 'positive',
      icon: DollarSign,
    },
    {
      name: 'Active Campaigns',
      value: data.campaigns.active.toLocaleString(),
      change: `${data.campaigns.active}/${data.campaigns.total}`,
      changeType: 'neutral',
      icon: Target,
    },
    {
      name: 'System Alerts',
      value: data.alerts.critical.toString(),
      change: `${data.alerts.warning} warnings`,
      changeType: data.alerts.critical > 0 ? 'negative' : 'neutral',
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Platform overview and system analytics
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.name}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className={`text-xs ${
                metric.changeType === 'positive' ? 'text-green-600' : 
                metric.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {metric.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### 4.3 User Management Table

```typescript
// components/admin/UserManagementTable.tsx
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MoreVertical, Search, Filter } from 'lucide-react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
  connectedAccountsCount: number;
  campaignsCount: number;
  totalSpend: number;
  lastLoginAt: string;
  createdAt: string;
  isActive: boolean;
}

interface UserManagementTableProps {
  users: User[];
  onUserAction: (userId: string, action: string) => void;
}

export function UserManagementTable({ users, onUserAction }: UserManagementTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.subscriptionStatus === statusFilter;
    const matchesPlan = planFilter === 'all' || user.subscriptionPlan === planFilter;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'past_due': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="past_due">Past Due</SelectItem>
          </SelectContent>
        </Select>
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="starter">Starter</SelectItem>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Subscription</TableHead>
            <TableHead>Accounts</TableHead>
            <TableHead>Campaigns</TableHead>
            <TableHead>Total Spend</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{user.firstName} {user.lastName}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium capitalize">{user.subscriptionPlan}</div>
                  <Badge className={getStatusColor(user.subscriptionStatus)}>
                    {user.subscriptionStatus}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>{user.connectedAccountsCount}</TableCell>
              <TableCell>{user.campaignsCount}</TableCell>
              <TableCell>${user.totalSpend.toLocaleString()}</TableCell>
              <TableCell>
                {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
              </TableCell>
              <TableCell>
                <Badge variant={user.isActive ? "default" : "secondary"}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

### 4.4 Revenue Analytics Chart

```typescript
// components/admin/RevenueAnalyticsChart.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RevenueAnalyticsChartProps {
  data: {
    historical: {
      date: string;
      mrr: number;
      subscribers: number;
      churnRate: number;
    }[];
    plans: {
      plan: string;
      subscribers: number;
      revenue: number;
      growthRate: number;
    }[];
  };
}

export function RevenueAnalyticsChart({ data }: RevenueAnalyticsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="trends" className="w-full">
          <TabsList>
            <TabsTrigger value="trends">MRR Trends</TabsTrigger>
            <TabsTrigger value="plans">Plan Distribution</TabsTrigger>
            <TabsTrigger value="churn">Churn Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trends" className="space-y-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.historical}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="mrr" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="plans" className="space-y-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.plans}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="plan" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="churn" className="space-y-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.historical}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="churnRate" stroke="#EF4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
```

---

## 5. Admin Service Implementation

### 5.1 Admin Service

```typescript
// services/AdminService.ts
import { PrismaClient } from '@prisma/client';

export class AdminService {
  private prisma = new PrismaClient();

  async getSystemOverview() {
    const [
      totalUsers,
      activeUsers,
      newUsersThisMonth,
      totalSubscriptions,
      activeSubscriptions,
      totalCampaigns,
      activeCampaigns,
      totalRevenue
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { subscriptionStatus: 'active' } }),
      this.prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      this.prisma.subscription.count(),
      this.prisma.subscription.count({ where: { status: 'active' } }),
      this.prisma.campaign.count(),
      this.prisma.campaign.count({ where: { status: 'active' } }),
      this.prisma.subscription.aggregate({
        where: { status: 'active' },
        _sum: { amount: true }
      })
    ]);

    const mrr = totalRevenue._sum.amount || 0;
    const arr = mrr * 12;

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        newThisMonth: newUsersThisMonth,
        growthRate: this.calculateGrowthRate(totalUsers, newUsersThisMonth)
      },
      revenue: {
        mrr,
        arr,
        growthRate: 0, // Calculate from historical data
        churnRate: 0 // Calculate from historical data
      },
      campaigns: {
        total: totalCampaigns,
        active: activeCampaigns,
        totalSpend: 0 // Calculate from campaign performance
      },
      alerts: {
        critical: 0, // Calculate from system health
        warning: 0
      }
    };
  }

  async getUsers(options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    plan?: string;
  } = {}) {
    const { page = 1, limit = 20, search, status, plan } = options;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (status) where.subscriptionStatus = status;
    if (plan) where.subscriptionPlan = plan;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        include: {
          subscriptions: true,
          connectedAdAccounts: true,
          campaigns: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.user.count({ where })
    ]);

    const usersWithMetrics = users.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      subscriptionPlan: user.subscriptionPlan,
      subscriptionStatus: user.subscriptionStatus,
      connectedAccountsCount: user.connectedAdAccounts.length,
      campaignsCount: user.campaigns.length,
      totalSpend: this.calculateUserTotalSpend(user.campaigns),
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      isActive: user.subscriptionStatus === 'active'
    }));

    return {
      users: usersWithMetrics,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getUserDetails(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: {
          include: {
            invoices: true
          }
        },
        connectedAdAccounts: {
          include: {
            campaigns: {
              include: {
                performance: true
              }
            }
          }
        },
        campaigns: {
          include: {
            performance: true
          }
        }
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        subscription: user.subscriptions[0] || null,
        connectedAccounts: user.connectedAdAccounts,
        campaigns: user.campaigns,
        analytics: this.calculateUserAnalytics(user),
        activity: await this.getUserActivity(userId)
      }
    };
  }

  async updateUser(userId: string, data: any) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        subscriptionPlan: data.subscriptionPlan,
        subscriptionStatus: data.isActive ? 'active' : 'suspended'
      }
    });
  }

  async suspendUser(userId: string, reason: string, duration?: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Update user status
    await this.prisma.user.update({
      where: { id: userId },
      data: { subscriptionStatus: 'suspended' }
    });

    // Log admin action
    await this.prisma.adminActivityLog.create({
      data: {
        adminUserId: 'admin-user-id', // Get from context
        action: 'suspend_user',
        resourceType: 'user',
        resourceId: userId,
        details: { reason, duration }
      }
    });

    return { success: true };
  }

  private calculateGrowthRate(total: number, newThisMonth: number): number {
    if (total === 0) return 0;
    return Math.round((newThisMonth / total) * 100);
  }

  private calculateUserTotalSpend(campaigns: any[]): number {
    return campaigns.reduce((total, campaign) => {
      return total + campaign.performance.reduce((sum: number, perf: any) => {
        return sum + Number(perf.spend);
      }, 0);
    }, 0);
  }

  private calculateUserAnalytics(user: any) {
    const totalCampaigns = user.campaigns.length;
    const activeCampaigns = user.campaigns.filter((c: any) => c.status === 'active').length;
    const totalSpend = this.calculateUserTotalSpend(user.campaigns);

    return {
      totalCampaigns,
      activeCampaigns,
      totalSpend,
      averageSpendPerCampaign: totalCampaigns > 0 ? totalSpend / totalCampaigns : 0
    };
  }

  private async getUserActivity(userId: string) {
    // Implement user activity tracking
    return [];
  }
}
```

---

## 6. Admin Authentication & Authorization

### 6.1 Admin Authentication Middleware

```typescript
// middleware/adminAuth.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AdminRequest extends Request {
  admin?: {
    id: string;
    email: string;
    role: string;
    permissions: string[];
  };
}

export function authenticateAdmin(
  req: AdminRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Admin access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET!) as any;
    req.admin = {
      id: decoded.adminId,
      email: decoded.email,
      role: decoded.role,
      permissions: decoded.permissions
    };
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid admin token' });
  }
}

export function requireAdminRole(role: string) {
  return (req: AdminRequest, res: Response, next: NextFunction) => {
    if (!req.admin) {
      return res.status(401).json({ error: 'Admin authentication required' });
    }

    if (req.admin.role !== role && req.admin.role !== 'super_admin') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}

export function requirePermission(permission: string) {
  return (req: AdminRequest, res: Response, next: NextFunction) => {
    if (!req.admin) {
      return res.status(401).json({ error: 'Admin authentication required' });
    }

    if (!req.admin.permissions.includes(permission)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}
```

---

## 7. Admin Dashboard Routes

### 7.1 Admin Routes

```typescript
// routes/admin.ts
import express from 'express';
import { authenticateAdmin, requireAdminRole, requirePermission } from '../middleware/adminAuth';
import { AdminService } from '../services/AdminService';

const router = express.Router();
const adminService = new AdminService();

// All admin routes require authentication
router.use(authenticateAdmin);

// Dashboard overview
router.get('/overview', requirePermission('view_dashboard'), async (req, res) => {
  try {
    const overview = await adminService.getSystemOverview();
    res.json(overview);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get system overview' });
  }
});

// User management
router.get('/users', requirePermission('view_users'), async (req, res) => {
  try {
    const users = await adminService.getUsers(req.query);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get users' });
  }
});

router.get('/users/:id', requirePermission('view_users'), async (req, res) => {
  try {
    const user = await adminService.getUserDetails(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user details' });
  }
});

router.put('/users/:id', requirePermission('edit_users'), async (req, res) => {
  try {
    const user = await adminService.updateUser(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.post('/users/:id/suspend', requirePermission('suspend_users'), async (req, res) => {
  try {
    const result = await adminService.suspendUser(req.params.id, req.body.reason, req.body.duration);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to suspend user' });
  }
});

// Revenue analytics
router.get('/analytics/revenue', requirePermission('view_analytics'), async (req, res) => {
  try {
    const analytics = await adminService.getRevenueAnalytics();
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get revenue analytics' });
  }
});

// System analytics
router.get('/analytics/system', requirePermission('view_analytics'), async (req, res) => {
  try {
    const analytics = await adminService.getSystemAnalytics();
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get system analytics' });
  }
});

export default router;
```

---

## 8. Admin Dashboard Pages

### 8.1 Admin Dashboard Structure

```
/admin
├── /dashboard          # Overview dashboard
├── /users              # User management
│   ├── /list          # All users table
│   ├── /:id           # Individual user details
│   └── /analytics     # User analytics
├── /subscriptions      # Subscription management
│   ├── /list          # All subscriptions
│   ├── /analytics     # Revenue analytics
│   └── /plans         # Plan management
├── /accounts           # Connected accounts
│   ├── /list          # All connected accounts
│   ├── /health        # Account health monitoring
│   └── /analytics     # Platform analytics
├── /campaigns          # Campaign analytics
│   ├── /list          # All campaigns
│   ├── /performance   # Performance metrics
│   └── /trends        # Trend analysis
└── /system             # System management
    ├── /analytics     # System analytics
    ├── /logs          # System logs
    └── /settings      # System settings
```

This comprehensive admin dashboard provides full visibility and control over the platform, including user management, subscription analytics, account monitoring, campaign performance, and system health metrics.
