import {
  users,
  adAccounts,
  campaigns,
  campaignMetrics,
  teamMembers,
  notifications,
  type User,
  type UpsertUser,
  type AdAccount,
  type InsertAdAccount,
  type Campaign,
  type InsertCampaign,
  type CampaignMetrics,
  type TeamMember,
  type InsertTeamMember,
  type Notification,
  type InsertNotification,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeInfo(id: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User>;
  
  // Ad Account operations
  getAdAccounts(userId: string): Promise<AdAccount[]>;
  createAdAccount(adAccount: InsertAdAccount): Promise<AdAccount>;
  updateAdAccount(id: string, updates: Partial<AdAccount>): Promise<AdAccount>;
  deleteAdAccount(id: string): Promise<void>;
  
  // Campaign operations
  getCampaigns(userId: string): Promise<Campaign[]>;
  getCampaign(id: string): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign>;
  deleteCampaign(id: string): Promise<void>;
  
  // Campaign Metrics operations
  getCampaignMetrics(campaignId: string, startDate?: Date, endDate?: Date): Promise<CampaignMetrics[]>;
  createCampaignMetrics(metrics: Omit<CampaignMetrics, 'id' | 'createdAt'>): Promise<CampaignMetrics>;
  
  // Team operations
  getTeamMembers(teamOwnerId: string): Promise<TeamMember[]>;
  createTeamMember(teamMember: InsertTeamMember): Promise<TeamMember>;
  updateTeamMember(id: string, updates: Partial<TeamMember>): Promise<TeamMember>;
  deleteTeamMember(id: string): Promise<void>;
  
  // Notification operations
  getNotifications(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserStripeInfo(id: string, stripeCustomerId: string, stripeSubscriptionId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId,
        stripeSubscriptionId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Ad Account operations
  async getAdAccounts(userId: string): Promise<AdAccount[]> {
    return await db.select().from(adAccounts).where(eq(adAccounts.userId, userId));
  }

  async createAdAccount(adAccount: InsertAdAccount): Promise<AdAccount> {
    const [newAccount] = await db
      .insert(adAccounts)
      .values(adAccount)
      .returning();
    return newAccount;
  }

  async updateAdAccount(id: string, updates: Partial<AdAccount>): Promise<AdAccount> {
    const [account] = await db
      .update(adAccounts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(adAccounts.id, id))
      .returning();
    return account;
  }

  async deleteAdAccount(id: string): Promise<void> {
    await db.delete(adAccounts).where(eq(adAccounts.id, id));
  }

  // Campaign operations
  async getCampaigns(userId: string): Promise<Campaign[]> {
    return await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.userId, userId))
      .orderBy(desc(campaigns.createdAt));
  }

  async getCampaign(id: string): Promise<Campaign | undefined> {
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return campaign;
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const [newCampaign] = await db
      .insert(campaigns)
      .values(campaign)
      .returning();
    return newCampaign;
  }

  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign> {
    const [campaign] = await db
      .update(campaigns)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(campaigns.id, id))
      .returning();
    return campaign;
  }

  async deleteCampaign(id: string): Promise<void> {
    await db.delete(campaigns).where(eq(campaigns.id, id));
  }

  // Campaign Metrics operations
  async getCampaignMetrics(campaignId: string, startDate?: Date, endDate?: Date): Promise<CampaignMetrics[]> {
    if (startDate && endDate) {
      return await db
        .select()
        .from(campaignMetrics)
        .where(
          and(
            eq(campaignMetrics.campaignId, campaignId),
            gte(campaignMetrics.date, startDate),
            lte(campaignMetrics.date, endDate)
          )
        )
        .orderBy(desc(campaignMetrics.date));
    }
    
    return await db
      .select()
      .from(campaignMetrics)
      .where(eq(campaignMetrics.campaignId, campaignId))
      .orderBy(desc(campaignMetrics.date));
  }

  async createCampaignMetrics(metrics: Omit<CampaignMetrics, 'id' | 'createdAt'>): Promise<CampaignMetrics> {
    const [newMetrics] = await db
      .insert(campaignMetrics)
      .values(metrics)
      .returning();
    return newMetrics;
  }

  // Team operations
  async getTeamMembers(teamOwnerId: string): Promise<TeamMember[]> {
    return await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.teamOwnerId, teamOwnerId))
      .orderBy(desc(teamMembers.invitedAt));
  }

  async createTeamMember(teamMember: InsertTeamMember): Promise<TeamMember> {
    const [newMember] = await db
      .insert(teamMembers)
      .values(teamMember)
      .returning();
    return newMember;
  }

  async updateTeamMember(id: string, updates: Partial<TeamMember>): Promise<TeamMember> {
    const [member] = await db
      .update(teamMembers)
      .set(updates)
      .where(eq(teamMembers.id, id))
      .returning();
    return member;
  }

  async deleteTeamMember(id: string): Promise<void> {
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
  }

  // Notification operations
  async getNotifications(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(50);
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db
      .insert(notifications)
      .values(notification)
      .returning();
    return newNotification;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id));
  }
}

export const storage = new DatabaseStorage();
