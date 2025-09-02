import express from "express";
import { createServer } from "http";
import cors from "cors";
import session from "express-session";
import path from "path";
import { initDatabase } from "./db";

const app = express();
const server = createServer(app);

// Initialize database on startup
initDatabase();

// CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://your-domain.replit.app"]
        : [
            "http://localhost:5173",
            "http://0.0.0.0:5173",
            "http://localhost:3000",
            "http://0.0.0.0:3000",
            "*",
            /\.replit\.dev$/,
          ],
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration for development (without database sessions for now)
app.use(
  session({
    secret:
      process.env.SESSION_SECRET || "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
);

// Mock authentication for development
app.get("/api/login", (req, res) => {
  try {
    // For development, create a mock user session
    const mockUser = {
      id: "user_123",
      name: "John Doe",
      email: "john@example.com",
      profileImage: null,
    };

    req.session.user = mockUser;
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

app.get("/api/callback", (req, res) => {
  try {
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Callback error:", error);
    res.status(500).json({ error: "Callback failed" });
  }
});

app.get("/api/user", (req, res) => {
  try {
    if (req.session.user) {
      res.json(req.session.user);
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  } catch (error) {
    console.error("User fetch error:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

app.post("/api/logout", (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ error: "Logout failed" });
      }
      res.clearCookie("connect.sid");
      res.json({ success: true });
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
});

// Mock API endpoints
app.get("/api/campaigns", (req, res) => {
  const mockCampaigns = [
    {
      id: "1",
      name: "Summer Sale Campaign",
      platform: "google",
      status: "active",
      budget: 5000,
      spend: 3200,
      impressions: 45000,
      clicks: 1200,
    },
    {
      id: "2",
      name: "Brand Awareness",
      platform: "facebook",
      status: "active",
      budget: 3000,
      spend: 1800,
      impressions: 28000,
      clicks: 850,
    },
  ];
  res.json(mockCampaigns);
});

app.get("/api/analytics", (req, res) => {
  const mockAnalytics = {
    totalSpend: 5000,
    totalImpressions: 73000,
    totalClicks: 2050,
    avgCPC: 2.44,
    avgCTR: 2.8,
  };
  res.json(mockAnalytics);
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Handle non-API routes
app.get("*", (req, res) => {
  // Let API routes pass through to 404
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }

  if (process.env.NODE_ENV === "production") {
    // In production, serve the built client files
    const distPath = path.resolve(import.meta.dirname, "../dist/public");
    res.sendFile(path.resolve(distPath, "index.html"));
  } else {
    // In development, let the client handle routing
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>AdFlow Platform - Redirecting...</title>
          <script>
            // Redirect to Vite dev server
            window.location.href = 'http://localhost:5173' + window.location.pathname;
          </script>
        </head>
        <body>
          <p>Redirecting to development server...</p>
        </body>
      </html>
    `);
  }
});

// Error handling middleware
app.use(
  (
    error: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error("Server error:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    });
  },
);

const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[express] serving on port ${PORT}`);
});

export default app;
