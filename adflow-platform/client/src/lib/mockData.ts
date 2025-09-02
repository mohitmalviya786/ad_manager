// This file contains mock data structures for development and testing
// In production, this would be replaced with actual API calls

export const mockCampaigns = [
  {
    id: "1",
    name: "Holiday Sale 2024",
    platform: "google",
    campaignType: "Search Campaign",
    status: "active",
    dailyBudget: 150,
    totalBudget: 4500,
    targetAudience: "Holiday shoppers aged 25-55",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    createdAt: "2024-01-01T00:00:00Z",
    metrics: {
      impressions: 45230,
      clicks: 3247,
      spend: 2347,
      conversions: 87,
      ctr: 7.2,
      roas: 4.8
    }
  },
  {
    id: "2", 
    name: "Q4 Product Launch",
    platform: "facebook",
    campaignType: "Traffic Campaign", 
    status: "paused",
    dailyBudget: 100,
    totalBudget: 3000,
    targetAudience: "Tech enthusiasts 18-45",
    startDate: "2024-10-01",
    endDate: "2024-12-31", 
    createdAt: "2024-10-01T00:00:00Z",
    metrics: {
      impressions: 32100,
      clicks: 1967,
      spend: 1892,
      conversions: 45,
      ctr: 6.1,
      roas: 3.6
    }
  },
  {
    id: "3",
    name: "Brand Awareness Video", 
    platform: "youtube",
    campaignType: "Video Campaign",
    status: "active",
    dailyBudget: 75,
    totalBudget: 2250,
    targetAudience: "Video content consumers 16-35",
    startDate: "2024-11-01",
    endDate: "2024-12-31",
    createdAt: "2024-11-01T00:00:00Z", 
    metrics: {
      impressions: 234000,
      clicks: 5647,
      spend: 987,
      conversions: 23,
      ctr: 2.4,
      roas: 2.1
    }
  }
];

export const mockAdAccounts = [
  {
    id: "acc_1",
    platform: "google",
    accountId: "google_123456789", 
    accountName: "Google Ads Account",
    isConnected: true,
    lastSyncAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "acc_2",
    platform: "facebook",
    accountId: "facebook_987654321",
    accountName: "Facebook Business Account", 
    isConnected: true,
    lastSyncAt: "2024-01-15T09:45:00Z"
  },
  {
    id: "acc_3", 
    platform: "youtube",
    accountId: "youtube_456789123",
    accountName: "YouTube Channel",
    isConnected: true,
    lastSyncAt: "2024-01-15T11:15:00Z"
  }
];

export const mockNotifications = [
  {
    id: "notif_1",
    title: "Campaign 'Holiday Sale' approved",
    message: "Your Google Ads campaign is now live and running",
    type: "success",
    isRead: false,
    createdAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "notif_2",
    title: "Budget alert for 'Q4 Launch'", 
    message: "Campaign has spent 80% of daily budget",
    type: "warning",
    isRead: false,
    createdAt: "2024-01-15T08:30:00Z"
  },
  {
    id: "notif_3",
    title: "Performance report ready",
    message: "Your weekly analytics report is available for download",
    type: "info", 
    isRead: true,
    createdAt: "2024-01-14T16:00:00Z"
  }
];

export const mockTeamMembers = [
  {
    id: "member_1",
    email: "john.doe@company.com",
    role: "admin",
    status: "active",
    invitedAt: "2024-01-01T00:00:00Z",
    joinedAt: "2024-01-01T12:00:00Z"
  },
  {
    id: "member_2", 
    email: "sarah.miller@company.com",
    role: "manager",
    status: "active",
    invitedAt: "2024-01-05T00:00:00Z", 
    joinedAt: "2024-01-05T14:30:00Z"
  },
  {
    id: "member_3",
    email: "mike.johnson@company.com", 
    role: "analyst",
    status: "pending",
    invitedAt: "2024-01-10T00:00:00Z",
    joinedAt: null
  }
];

export const mockAnalyticsData = {
  conversionFunnel: [
    { name: "Impressions", value: 2400000, percentage: 100 },
    { name: "Clicks", value: 76800, percentage: 32 },
    { name: "Conversions", value: 2300, percentage: 3 }
  ],
  platformPerformance: [
    { name: "Google Ads", value: 45, color: "#4285F4" },
    { name: "Facebook", value: 35, color: "#1877F2" }, 
    { name: "Instagram", value: 20, color: "#E4405F" }
  ],
  revenueOverTime: [
    { name: "Week 1", revenue: 12000, spend: 3000, roas: 4.0 },
    { name: "Week 2", revenue: 15000, spend: 3500, roas: 4.3 },
    { name: "Week 3", revenue: 18000, spend: 4000, roas: 4.5 },
    { name: "Week 4", revenue: 22000, spend: 4500, roas: 4.9 }
  ]
};
