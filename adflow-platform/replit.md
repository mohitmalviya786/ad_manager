# Social Media Ad Campaign Management Platform

## Overview

This is a comprehensive social media ad campaign management platform that allows customers to manage their advertising campaigns across multiple platforms including Google Ads, Facebook Ads, Instagram Ads, and YouTube Ads. The platform provides centralized campaign management, real-time analytics, team collaboration features, and subscription-based access with tiered pricing plans.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Framework**: Tailwind CSS with Radix UI components (shadcn/ui)
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state management
- **Forms**: React Hook Form with Zod validation
- **Styling**: CSS variables for theming with dark mode support

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth (OAuth-based) with session management
- **API Design**: RESTful API with structured error handling and request logging
- **Real-time Features**: Prepared for Socket.io integration for notifications

### Database Design
- **ORM**: Drizzle with code-first schema approach
- **Schema**: Comprehensive tables for users, ad accounts, campaigns, metrics, team members, and notifications
- **Session Storage**: PostgreSQL-based session store for authentication
- **Relationships**: Proper foreign key relationships with cascade deletes

### Authentication & Authorization
- **Primary Auth**: Replit OAuth integration with JWT tokens
- **Session Management**: PostgreSQL-backed sessions with automatic expiration
- **Role-Based Access**: User roles (admin, manager, analyst) with permission-based access control
- **Token Security**: Secure token storage with automatic refresh capabilities

### Data Architecture
- **Campaign Management**: Support for multi-platform campaigns with unified data model
- **Metrics Tracking**: Time-series data storage for campaign performance metrics
- **Team Collaboration**: Multi-user accounts with role-based permissions
- **Subscription Management**: Tiered plans (Starter $29, Professional $79, Enterprise $199)

## External Dependencies

### Payment Processing
- **Stripe**: Complete integration for subscription management and payment processing
- **Plans**: Three-tier subscription model with different feature access levels

### Database & Hosting
- **Neon Database**: Serverless PostgreSQL for production data storage
- **Connection Pooling**: Optimized database connections for scalability

### Social Media Platform Integrations
- **OAuth Providers**: Google Ads, Facebook Ads, Instagram Ads, YouTube Ads
- **API Integrations**: Prepared infrastructure for connecting to advertising platforms
- **Token Management**: Secure storage and refresh of OAuth tokens

### Development & Monitoring
- **Build Tools**: Vite for fast development and optimized production builds
- **Type Safety**: Full TypeScript coverage across frontend, backend, and shared schemas
- **Error Handling**: Comprehensive error boundaries and API error management

### UI & Styling
- **Component Library**: Radix UI primitives with custom styling
- **Icons**: Lucide React for general icons, React Icons for platform-specific icons
- **Charts**: Recharts for analytics and data visualization
- **Responsive Design**: Mobile-first approach with responsive breakpoints