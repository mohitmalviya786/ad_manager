# Technical Specifications
## Social Media Ad Campaign Management Platform

## 1. Database Schema

### Core Tables

```sql
-- Users and Authentication
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  avatar_url VARCHAR(500),
  subscription_plan VARCHAR(50) DEFAULT 'free',
  subscription_status VARCHAR(50) DEFAULT 'active',
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Connected Ad Accounts (Customer's accounts)
CREATE TABLE connected_ad_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL, -- google, facebook, instagram, youtube
  account_name VARCHAR(255) NOT NULL,
  account_id VARCHAR(255) NOT NULL, -- Platform-specific account ID
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMP,
  permissions TEXT[], -- Array of granted permissions
  is_active BOOLEAN DEFAULT TRUE,
  last_sync_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, platform, account_id)
);

-- Campaigns (Managed through customer's accounts)
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  connected_account_id UUID REFERENCES connected_ad_accounts(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  platform VARCHAR(50) NOT NULL, -- google, facebook, instagram, youtube
  status VARCHAR(50) DEFAULT 'draft', -- draft, active, paused, completed
  budget DECIMAL(10,2) NOT NULL,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  targeting_config JSONB,
  platform_campaign_id VARCHAR(255), -- ID from the platform
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ad Creatives
CREATE TABLE ad_creatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- image, video, carousel
  content JSONB NOT NULL,
  media_urls TEXT[],
  platform_creative_id VARCHAR(255), -- ID from the platform
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Campaign Performance (From customer's accounts)
CREATE TABLE campaign_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  spend DECIMAL(10,2) DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions (Platform usage)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  stripe_subscription_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Platform Usage Tracking
CREATE TABLE platform_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  connected_account_id UUID REFERENCES connected_ad_accounts(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  campaigns_managed INTEGER DEFAULT 0,
  api_calls INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Team Management
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL, -- owner, admin, manager, viewer
  permissions TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 2. API Design

### Authentication Endpoints

```typescript
// POST /api/auth/register
interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface RegisterResponse {
  user: User;
  token: string;
}

// POST /api/auth/login
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

// GET /api/auth/me
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
}
```

### Ad Account Connection Endpoints

```typescript
// GET /api/ad-accounts
interface GetAdAccountsResponse {
  accounts: ConnectedAdAccount[];
}

// POST /api/ad-accounts/connect/google
interface ConnectGoogleAdsRequest {
  authorizationCode: string;
  redirectUri: string;
}

// POST /api/ad-accounts/connect/facebook
interface ConnectFacebookAdsRequest {
  accessToken: string;
  accountId: string;
}

// GET /api/ad-accounts/:id
interface ConnectedAdAccount {
  id: string;
  platform: 'google' | 'facebook' | 'instagram' | 'youtube';
  accountName: string;
  accountId: string;
  isActive: boolean;
  lastSyncAt: string;
  permissions: string[];
  campaigns: Campaign[];
}

// POST /api/ad-accounts/:id/refresh-token
interface RefreshTokenResponse {
  success: boolean;
  newExpiresAt: string;
}
```

### Campaign Endpoints

```typescript
// GET /api/campaigns
interface GetCampaignsResponse {
  campaigns: Campaign[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// POST /api/campaigns
interface CreateCampaignRequest {
  connectedAccountId: string;
  name: string;
  platform: 'google' | 'facebook' | 'instagram' | 'youtube';
  budget: number;
  startDate?: string;
  endDate?: string;
  targeting: {
    locations?: string[];
    ageRange?: [number, number];
    interests?: string[];
    demographics?: Record<string, any>;
  };
  creatives: {
    name: string;
    type: 'image' | 'video' | 'carousel';
    content: Record<string, any>;
    mediaUrls: string[];
  }[];
}

// PUT /api/campaigns/:id
interface UpdateCampaignRequest {
  name?: string;
  budget?: number;
  status?: 'draft' | 'active' | 'paused' | 'completed';
  startDate?: string;
  endDate?: string;
  targeting?: Record<string, any>;
}

// GET /api/campaigns/:id/analytics
interface CampaignAnalyticsResponse {
  campaign: Campaign;
  performance: {
    totalImpressions: number;
    totalClicks: number;
    totalSpend: number;
    totalConversions: number;
    ctr: number;
    cpc: number;
    roas: number;
  };
  dailyData: {
    date: string;
    impressions: number;
    clicks: number;
    spend: number;
    conversions: number;
  }[];
  platformData?: Record<string, any>;
}
```

### Analytics Endpoints

```typescript
// GET /api/analytics/overview
interface AnalyticsOverviewResponse {
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  activeCampaigns: number;
  totalCampaigns: number;
  connectedAccounts: number;
  platformBreakdown: {
    platform: string;
    spend: number;
    impressions: number;
    clicks: number;
  }[];
  recentPerformance: {
    date: string;
    spend: number;
    impressions: number;
    clicks: number;
  }[];
}

// GET /api/analytics/reports
interface GetReportsResponse {
  reports: {
    id: string;
    name: string;
    type: 'daily' | 'weekly' | 'monthly';
    status: 'scheduled' | 'completed' | 'failed';
    lastGenerated?: string;
    nextScheduled?: string;
  }[];
}

// POST /api/analytics/reports
interface CreateReportRequest {
  name: string;
  type: 'daily' | 'weekly' | 'monthly';
  metrics: string[];
  filters?: Record<string, any>;
  recipients?: string[];
}
```

### Billing Endpoints

```typescript
// GET /api/billing/subscription
interface SubscriptionResponse {
  subscription: {
    id: string;
    plan: string;
    status: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    amount: number;
    currency: string;
  };
  plan: {
    id: string;
    name: string;
    price: number;
    features: string[];
    limits: Record<string, number>;
  };
}

// POST /api/billing/subscription
interface CreateSubscriptionRequest {
  planId: string;
  paymentMethodId: string;
}

// GET /api/billing/invoices
interface InvoicesResponse {
  invoices: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    dueDate: string;
    paidAt?: string;
    invoiceUrl: string;
  }[];
}
```

## 3. Frontend Components

### Ad Account Connection Component

```typescript
// components/ad-accounts/AccountConnection.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Google, Facebook, Instagram, Youtube, Plus } from 'lucide-react';

interface AccountConnectionProps {
  onConnect: (platform: string) => void;
}

export function AccountConnection({ onConnect }: AccountConnectionProps) {
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  const platforms = [
    {
      id: 'google',
      name: 'Google Ads',
      icon: Google,
      description: 'Connect your Google Ads account to manage campaigns',
      color: 'bg-blue-500'
    },
    {
      id: 'facebook',
      name: 'Facebook Ads',
      icon: Facebook,
      description: 'Connect your Facebook Ads account to manage campaigns',
      color: 'bg-blue-600'
    },
    {
      id: 'instagram',
      name: 'Instagram Ads',
      icon: Instagram,
      description: 'Connect your Instagram Ads account to manage campaigns',
      color: 'bg-pink-500'
    },
    {
      id: 'youtube',
      name: 'YouTube Ads',
      icon: Youtube,
      description: 'Connect your YouTube Ads account to manage campaigns',
      color: 'bg-red-500'
    }
  ];

  const handleConnect = async (platform: string) => {
    setIsConnecting(platform);
    try {
      onConnect(platform);
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setIsConnecting(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {platforms.map((platform) => (
        <Card key={platform.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="text-center">
            <div className={`w-12 h-12 ${platform.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
              <platform.icon className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-lg">{platform.name}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              {platform.description}
            </p>
            <Button
              onClick={() => handleConnect(platform.id)}
              disabled={isConnecting === platform.id}
              className="w-full"
            >
              {isConnecting === platform.id ? (
                'Connecting...'
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Connect Account
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

### Connected Accounts Dashboard

```typescript
// components/ad-accounts/ConnectedAccounts.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVertical, RefreshCw, Settings, Trash2 } from 'lucide-react';

interface ConnectedAccount {
  id: string;
  platform: 'google' | 'facebook' | 'instagram' | 'youtube';
  accountName: string;
  accountId: string;
  isActive: boolean;
  lastSyncAt: string;
  campaignsCount: number;
  totalSpend: number;
}

interface ConnectedAccountsProps {
  accounts: ConnectedAccount[];
  onRefresh: (accountId: string) => void;
  onDisconnect: (accountId: string) => void;
  onSettings: (accountId: string) => void;
}

export function ConnectedAccounts({ 
  accounts, 
  onRefresh, 
  onDisconnect, 
  onSettings 
}: ConnectedAccountsProps) {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'google': return '🔍';
      case 'facebook': return '📘';
      case 'instagram': return '📷';
      case 'youtube': return '📺';
      default: return '📊';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'google': return 'bg-blue-100 text-blue-800';
      case 'facebook': return 'bg-blue-100 text-blue-800';
      case 'instagram': return 'bg-pink-100 text-pink-800';
      case 'youtube': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Connected Ad Accounts</h2>
        <Badge variant="secondary">{accounts.length} accounts</Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <Card key={account.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getPlatformIcon(account.platform)}</span>
                <div>
                  <CardTitle className="text-sm font-medium">
                    {account.accountName}
                  </CardTitle>
                  <p className="text-xs text-gray-500">{account.accountId}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Badge className={getPlatformColor(account.platform)}>
                  {account.platform}
                </Badge>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <p className="text-gray-500">Campaigns</p>
                  <p className="font-medium">{account.campaignsCount}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Spend</p>
                  <p className="font-medium">${account.totalSpend.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>Last sync: {new Date(account.lastSyncAt).toLocaleDateString()}</span>
                <Badge variant={account.isActive ? "default" : "secondary"}>
                  {account.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRefresh(account.id)}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Sync
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSettings(account.id)}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Settings
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDisconnect(account.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Disconnect
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

## 4. Backend Services

### Ad Account Connection Service

```typescript
// services/AdAccountConnectionService.ts
import { PrismaClient } from '@prisma/client';
import { GoogleAdsService } from './GoogleAdsService';
import { FacebookAdsService } from './FacebookAdsService';

export class AdAccountConnectionService {
  private prisma = new PrismaClient();
  private googleAds = new GoogleAdsService();
  private facebookAds = new FacebookAdsService();

  async connectGoogleAdsAccount(userId: string, authorizationCode: string, redirectUri: string) {
    try {
      // Exchange authorization code for tokens
      const tokens = await this.googleAds.exchangeCodeForTokens(authorizationCode, redirectUri);
      
      // Get account information
      const accountInfo = await this.googleAds.getAccountInfo(tokens.access_token);
      
      // Store the connection
      const connectedAccount = await this.prisma.connectedAdAccount.create({
        data: {
          userId,
          platform: 'google',
          accountName: accountInfo.accountName,
          accountId: accountInfo.accountId,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          tokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000),
          permissions: tokens.scope.split(' '),
          isActive: true
        }
      });

      return connectedAccount;
    } catch (error) {
      throw new Error(`Failed to connect Google Ads account: ${error.message}`);
    }
  }

  async connectFacebookAdsAccount(userId: string, accessToken: string, accountId: string) {
    try {
      // Verify the access token and get account information
      const accountInfo = await this.facebookAds.getAccountInfo(accessToken, accountId);
      
      // Store the connection
      const connectedAccount = await this.prisma.connectedAdAccount.create({
        data: {
          userId,
          platform: 'facebook',
          accountName: accountInfo.name,
          accountId: accountInfo.id,
          accessToken,
          permissions: accountInfo.permissions,
          isActive: true
        }
      });

      return connectedAccount;
    } catch (error) {
      throw new Error(`Failed to connect Facebook Ads account: ${error.message}`);
    }
  }

  async refreshToken(accountId: string) {
    const account = await this.prisma.connectedAdAccount.findUnique({
      where: { id: accountId }
    });

    if (!account) {
      throw new Error('Account not found');
    }

    try {
      let newTokens;
      
      switch (account.platform) {
        case 'google':
          newTokens = await this.googleAds.refreshAccessToken(account.refreshToken);
          break;
        case 'facebook':
          newTokens = await this.facebookAds.refreshAccessToken(account.accessToken);
          break;
        default:
          throw new Error(`Unsupported platform: ${account.platform}`);
      }

      // Update the stored tokens
      await this.prisma.connectedAdAccount.update({
        where: { id: accountId },
        data: {
          accessToken: newTokens.access_token,
          refreshToken: newTokens.refresh_token || account.refreshToken,
          tokenExpiresAt: new Date(Date.now() + newTokens.expires_in * 1000),
          lastSyncAt: new Date()
        }
      });

      return { success: true, newExpiresAt: new Date(Date.now() + newTokens.expires_in * 1000) };
    } catch (error) {
      throw new Error(`Failed to refresh token: ${error.message}`);
    }
  }

  async getConnectedAccounts(userId: string) {
    return this.prisma.connectedAdAccount.findMany({
      where: { userId },
      include: {
        campaigns: {
          include: {
            performance: {
              orderBy: { date: 'desc' },
              take: 30
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async disconnectAccount(accountId: string, userId: string) {
    const account = await this.prisma.connectedAdAccount.findFirst({
      where: { id: accountId, userId }
    });

    if (!account) {
      throw new Error('Account not found');
    }

    // Revoke the access token on the platform
    try {
      switch (account.platform) {
        case 'google':
          await this.googleAds.revokeToken(account.accessToken);
          break;
        case 'facebook':
          await this.facebookAds.revokeToken(account.accessToken);
          break;
      }
    } catch (error) {
      console.error('Failed to revoke token on platform:', error);
    }

    // Delete the account connection
    await this.prisma.connectedAdAccount.delete({
      where: { id: accountId }
    });

    return { success: true };
  }
}
```

### Campaign Service (Updated for Connected Accounts)

```typescript
// services/CampaignService.ts
import { PrismaClient } from '@prisma/client';
import { GoogleAdsService } from './GoogleAdsService';
import { FacebookAdsService } from './FacebookAdsService';

export class CampaignService {
  private prisma = new PrismaClient();
  private googleAds = new GoogleAdsService();
  private facebookAds = new FacebookAdsService();

  async getCampaigns(userId: string, options: {
    page?: number;
    limit?: number;
    status?: string;
    platform?: string;
    connectedAccountId?: string;
  } = {}) {
    const { page = 1, limit = 10, status, platform, connectedAccountId } = options;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (status) where.status = status;
    if (platform) where.platform = platform;
    if (connectedAccountId) where.connectedAccountId = connectedAccountId;

    const [campaigns, total] = await Promise.all([
      this.prisma.campaign.findMany({
        where,
        include: {
          connectedAdAccount: {
            select: {
              accountName: true,
              platform: true
            }
          },
          adCreatives: true,
          performance: {
            orderBy: { date: 'desc' },
            take: 30
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.campaign.count({ where })
    ]);

    // Calculate aggregated metrics
    const campaignsWithMetrics = campaigns.map(campaign => ({
      ...campaign,
      totalImpressions: campaign.performance.reduce((sum, p) => sum + p.impressions, 0),
      totalClicks: campaign.performance.reduce((sum, p) => sum + p.clicks, 0),
      totalSpend: campaign.performance.reduce((sum, p) => sum + Number(p.spend), 0),
      totalConversions: campaign.performance.reduce((sum, p) => sum + p.conversions, 0)
    }));

    return {
      campaigns: campaignsWithMetrics,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async createCampaign(data: any, userId: string) {
    // Verify the connected account belongs to the user
    const connectedAccount = await this.prisma.connectedAdAccount.findFirst({
      where: { id: data.connectedAccountId, userId }
    });

    if (!connectedAccount) {
      throw new Error('Connected account not found or access denied');
    }

    // Create campaign in our database
    const campaign = await this.prisma.campaign.create({
      data: {
        userId,
        connectedAccountId: data.connectedAccountId,
        name: data.name,
        platform: connectedAccount.platform,
        budget: data.budget,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        targetingConfig: data.targeting
      },
      include: {
        connectedAdAccount: true
      }
    });

    // Create campaign on the platform using customer's account
    await this.createPlatformCampaign(campaign, data, connectedAccount);

    // Create ad creatives
    if (data.creatives && data.creatives.length > 0) {
      await Promise.all(
        data.creatives.map((creative: any) =>
          this.prisma.adCreative.create({
            data: {
              name: creative.name,
              type: creative.type,
              content: creative.content,
              mediaUrls: creative.mediaUrls,
              campaignId: campaign.id
            }
          })
        )
      );
    }

    return this.getCampaignById(campaign.id);
  }

  private async createPlatformCampaign(campaign: any, data: any, connectedAccount: any) {
    try {
      let platformCampaignId: string;

      switch (connectedAccount.platform) {
        case 'google':
          platformCampaignId = await this.googleAds.createCampaign(
            connectedAccount.accountId,
            connectedAccount.accessToken,
            data
          );
          break;
        case 'facebook':
        case 'instagram':
          platformCampaignId = await this.facebookAds.createCampaign(
            connectedAccount.accountId,
            connectedAccount.accessToken,
            data
          );
          break;
        default:
          throw new Error(`Unsupported platform: ${connectedAccount.platform}`);
      }

      // Update campaign with platform ID
      await this.prisma.campaign.update({
        where: { id: campaign.id },
        data: { platformCampaignId }
      });
    } catch (error) {
      console.error('Failed to create platform campaign:', error);
      // Don't throw error to avoid breaking the main flow
    }
  }

  async updateCampaign(id: string, data: any, userId: string) {
    const campaign = await this.prisma.campaign.findFirst({
      where: { id, userId },
      include: { connectedAdAccount: true }
    });

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    const updatedCampaign = await this.prisma.campaign.update({
      where: { id },
      data: {
        name: data.name,
        budget: data.budget,
        status: data.status,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        targetingConfig: data.targeting
      },
      include: {
        connectedAdAccount: true,
        adCreatives: true
      }
    });

    // Update campaign on platform if status changed
    if (data.status && data.status !== campaign.status) {
      await this.updatePlatformCampaign(campaign, data);
    }

    return updatedCampaign;
  }

  private async updatePlatformCampaign(campaign: any, data: any) {
    try {
      switch (campaign.connectedAdAccount.platform) {
        case 'google':
          await this.googleAds.updateCampaign(
            campaign.platformCampaignId,
            campaign.connectedAdAccount.accessToken,
            data
          );
          break;
        case 'facebook':
        case 'instagram':
          await this.facebookAds.updateCampaign(
            campaign.platformCampaignId,
            campaign.connectedAdAccount.accessToken,
            data
          );
          break;
      }
    } catch (error) {
      console.error('Failed to update platform campaign:', error);
    }
  }
}
```

## 5. OAuth Implementation

### Google Ads OAuth Flow

```typescript
// services/GoogleAdsService.ts
import { google } from 'googleapis';

export class GoogleAdsService {
  private oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_ADS_CLIENT_ID,
    process.env.GOOGLE_ADS_CLIENT_SECRET,
    process.env.GOOGLE_ADS_REDIRECT_URI
  );

  async getAuthUrl() {
    const scopes = [
      'https://www.googleapis.com/auth/adwords',
      'https://www.googleapis.com/auth/userinfo.email'
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
  }

  async exchangeCodeForTokens(authorizationCode: string, redirectUri: string) {
    this.oauth2Client.setCredentials({ redirect_uri: redirectUri });
    
    const { tokens } = await this.oauth2Client.getToken(authorizationCode);
    return tokens;
  }

  async refreshAccessToken(refreshToken: string) {
    this.oauth2Client.setCredentials({ refresh_token: refreshToken });
    
    const { credentials } = await this.oauth2Client.refreshAccessToken();
    return credentials;
  }

  async getAccountInfo(accessToken: string) {
    this.oauth2Client.setCredentials({ access_token: accessToken });
    
    const customerService = google.ads({
      version: 'v14',
      auth: this.oauth2Client
    });

    const response = await customerService.customers.list({
      auth: this.oauth2Client
    });

    return response.data.results[0];
  }

  async createCampaign(accountId: string, accessToken: string, campaignData: any) {
    this.oauth2Client.setCredentials({ access_token: accessToken });
    
    const customerService = google.ads({
      version: 'v14',
      auth: this.oauth2Client
    });

    const campaign = await customerService.customers.campaigns.create({
      customer: accountId,
      requestBody: {
        name: campaignData.name,
        status: 'PAUSED',
        campaignBudget: campaignData.budget,
        advertisingChannelType: 'SEARCH',
        startDate: campaignData.startDate,
        endDate: campaignData.endDate
      }
    });

    return campaign.data.id;
  }

  async revokeToken(accessToken: string) {
    try {
      await this.oauth2Client.revokeToken(accessToken);
    } catch (error) {
      console.error('Failed to revoke Google token:', error);
    }
  }
}
```

### Facebook Ads OAuth Flow

```typescript
// services/FacebookAdsService.ts
import axios from 'axios';

export class FacebookAdsService {
  private appId = process.env.FACEBOOK_APP_ID;
  private appSecret = process.env.FACEBOOK_APP_SECRET;

  async getAuthUrl() {
    const redirectUri = process.env.FACEBOOK_REDIRECT_URI;
    const scope = 'ads_management,ads_read,business_management';
    
    return `https://www.facebook.com/v18.0/dialog/oauth?client_id=${this.appId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
  }

  async exchangeCodeForTokens(authorizationCode: string, redirectUri: string) {
    const response = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: {
        client_id: this.appId,
        client_secret: this.appSecret,
        code: authorizationCode,
        redirect_uri: redirectUri
      }
    });

    return response.data;
  }

  async getAccountInfo(accessToken: string, accountId: string) {
    const response = await axios.get(`https://graph.facebook.com/v18.0/${accountId}`, {
      params: {
        access_token: accessToken,
        fields: 'id,name,account_status,currency,timezone'
      }
    });

    return response.data;
  }

  async createCampaign(accountId: string, accessToken: string, campaignData: any) {
    const response = await axios.post(`https://graph.facebook.com/v18.0/${accountId}/campaigns`, {
      name: campaignData.name,
      objective: 'OUTCOME_TRAFFIC',
      status: 'PAUSED',
      special_ad_categories: []
    }, {
      params: { access_token: accessToken }
    });

    return response.data.id;
  }

  async revokeToken(accessToken: string) {
    try {
      await axios.delete('https://graph.facebook.com/v18.0/me/permissions', {
        params: { access_token: accessToken }
      });
    } catch (error) {
      console.error('Failed to revoke Facebook token:', error);
    }
  }
}
```

This technical specification provides a comprehensive foundation for implementing the social media ad campaign management platform with all necessary components, security measures, and deployment configurations, focusing on customers connecting their own ad accounts to our platform for management.
