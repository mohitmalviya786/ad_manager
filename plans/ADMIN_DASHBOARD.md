# Admin Dashboard
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

## 2. Admin API Endpoints

### 2.1 User Management APIs
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
```

### 2.2 Subscription Management APIs
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
```

### 2.3 Account Management APIs
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
```

### 2.4 Campaign Analytics APIs
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

### 2.5 System Analytics APIs
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

## 3. Admin Dashboard UI Components

### 3.1 Admin Dashboard Overview
```typescript
// components/admin/AdminOverview.tsx
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
  );
}
```

### 3.2 User Management Table
```typescript
// components/admin/UserManagementTable.tsx
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

export function UserManagementTable({ users, onUserAction }: UserManagementTableProps) {
  return (
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
        {users.map((user) => (
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
  );
}
```

### 3.3 Revenue Analytics Chart
```typescript
// components/admin/RevenueAnalyticsChart.tsx
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

## 4. Admin Dashboard Pages

### 4.1 Admin Dashboard Structure
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

### 4.2 Admin Dashboard Features Summary

#### **User Management**
- View all users with search and filters
- Individual user profiles with detailed analytics
- Suspend/activate users
- Upgrade/downgrade subscriptions
- View user activity and usage

#### **Subscription Management**
- Monitor all subscriptions and revenue
- MRR/ARR tracking and growth analysis
- Churn rate analysis and prevention
- Plan management and pricing
- Billing issue resolution

#### **Account Management**
- Monitor all connected ad accounts
- Account health and sync status
- Platform-specific analytics
- Token refresh and troubleshooting
- Account disconnection management

#### **Campaign Analytics**
- Platform-wide campaign performance
- Aggregate metrics and trends
- Performance alerts and monitoring
- Cross-platform insights
- ROI and efficiency analysis

#### **System Analytics**
- Platform usage and performance
- API call monitoring
- Error tracking and resolution
- System health metrics
- Growth and scalability insights

This comprehensive admin dashboard provides full visibility and control over the platform, enabling administrators to manage users, monitor performance, track revenue, and ensure system health effectively.
