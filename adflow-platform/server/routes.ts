import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertCampaignSchema, insertAdAccountSchema, insertTeamMemberSchema } from "@shared/schema";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Campaign routes
  app.get("/api/campaigns", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const campaigns = await storage.getCampaigns(userId);
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  app.post("/api/campaigns", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const campaignData = insertCampaignSchema.parse({
        ...req.body,
        userId,
      });
      const campaign = await storage.createCampaign(campaignData);
      
      // Create notification
      await storage.createNotification({
        userId,
        title: "Campaign Created",
        message: `Campaign "${campaign.name}" has been created successfully`,
        type: "success",
        relatedEntityType: "campaign",
        relatedEntityId: campaign.id,
      });
      
      res.json(campaign);
    } catch (error) {
      console.error("Error creating campaign:", error);
      res.status(500).json({ message: "Failed to create campaign" });
    }
  });

  app.put("/api/campaigns/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      
      // Verify ownership
      const existingCampaign = await storage.getCampaign(id);
      if (!existingCampaign || existingCampaign.userId !== userId) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      const campaign = await storage.updateCampaign(id, req.body);
      res.json(campaign);
    } catch (error) {
      console.error("Error updating campaign:", error);
      res.status(500).json({ message: "Failed to update campaign" });
    }
  });

  app.delete("/api/campaigns/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      
      // Verify ownership
      const existingCampaign = await storage.getCampaign(id);
      if (!existingCampaign || existingCampaign.userId !== userId) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      await storage.deleteCampaign(id);
      res.json({ message: "Campaign deleted successfully" });
    } catch (error) {
      console.error("Error deleting campaign:", error);
      res.status(500).json({ message: "Failed to delete campaign" });
    }
  });

  // Ad Account routes
  app.get("/api/ad-accounts", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const accounts = await storage.getAdAccounts(userId);
      res.json(accounts);
    } catch (error) {
      console.error("Error fetching ad accounts:", error);
      res.status(500).json({ message: "Failed to fetch ad accounts" });
    }
  });

  app.post("/api/ad-accounts", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const accountData = insertAdAccountSchema.parse({
        ...req.body,
        userId,
      });
      const account = await storage.createAdAccount(accountData);
      res.json(account);
    } catch (error) {
      console.error("Error creating ad account:", error);
      res.status(500).json({ message: "Failed to create ad account" });
    }
  });

  // Team routes
  app.get("/api/team", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const teamMembers = await storage.getTeamMembers(userId);
      res.json(teamMembers);
    } catch (error) {
      console.error("Error fetching team members:", error);
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });

  app.post("/api/team", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const memberData = insertTeamMemberSchema.parse({
        ...req.body,
        teamOwnerId: userId,
      });
      const member = await storage.createTeamMember(memberData);
      
      // Create notification
      await storage.createNotification({
        userId,
        title: "Team Invitation Sent",
        message: `Invitation sent to ${member.email}`,
        type: "info",
        relatedEntityType: "team",
        relatedEntityId: member.id,
      });
      
      res.json(member);
    } catch (error) {
      console.error("Error inviting team member:", error);
      res.status(500).json({ message: "Failed to invite team member" });
    }
  });

  // Notification routes
  app.get("/api/notifications", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notifications = await storage.getNotifications(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.put("/api/notifications/:id/read", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.markNotificationAsRead(id);
      res.json({ message: "Notification marked as read" });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // Stripe subscription routes
  app.post('/api/create-subscription', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { priceId } = req.body;
      
      const user = await storage.getUser(userId);
      if (!user || !user.email) {
        return res.status(400).json({ message: "User email not found" });
      }

      let customerId = user.stripeCustomerId;

      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
        });
        customerId = customer.id;
        await storage.updateUserStripeInfo(userId, customerId, "");
      }

      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      await storage.updateUserStripeInfo(userId, customerId, subscription.id);

      const invoice = subscription.latest_invoice as any;
      res.json({
        subscriptionId: subscription.id,
        clientSecret: invoice.payment_intent.client_secret,
      });
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });

  // Mock OAuth routes for demonstration
  app.post("/api/oauth/connect/:platform", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { platform } = req.params;
      
      // In a real implementation, this would handle OAuth flow
      const mockAccount = {
        userId,
        platform,
        accountId: `${platform}_${Date.now()}`,
        accountName: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Account`,
        isConnected: true,
        accessToken: "mock_access_token",
        refreshToken: "mock_refresh_token",
        tokenExpiresAt: new Date(Date.now() + 3600000), // 1 hour
        lastSyncAt: new Date(),
      };
      
      const account = await storage.createAdAccount(mockAccount);
      
      await storage.createNotification({
        userId,
        title: "Account Connected",
        message: `${account.accountName} has been connected successfully`,
        type: "success",
        relatedEntityType: "account",
        relatedEntityId: account.id,
      });
      
      res.json(account);
    } catch (error) {
      console.error("Error connecting account:", error);
      res.status(500).json({ message: "Failed to connect account" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
