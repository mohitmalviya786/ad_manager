import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Download, ExternalLink, Crown, Zap, Users } from "lucide-react";

export default function Billing() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-effect rounded-xl p-8 animate-fade-in">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading billing...</p>
        </div>
      </div>
    );
  }

  const currentPlan = user?.subscriptionPlan || "starter";
  const nextBillingDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString();

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "$29",
      description: "Perfect for small businesses",
      icon: <Zap className="w-6 h-6" />,
      features: [
        "Up to 10 campaigns",
        "2 connected accounts",
        "Basic analytics",
        "Email support"
      ]
    },
    {
      id: "professional",
      name: "Professional",
      price: "$79",
      description: "Most popular for growing companies",
      icon: <Crown className="w-6 h-6" />,
      features: [
        "Up to 50 campaigns",
        "10 connected accounts",
        "Advanced analytics",
        "Team collaboration",
        "Priority support"
      ],
      popular: true
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$199",
      description: "For large organizations",
      icon: <Users className="w-6 h-6" />,
      features: [
        "Unlimited campaigns",
        "Unlimited accounts",
        "Custom analytics",
        "Advanced permissions",
        "24/7 dedicated support"
      ]
    }
  ];

  const mockInvoices = [
    {
      id: "inv_001",
      date: "2024-01-15",
      amount: "$79.00",
      status: "paid",
      description: "Professional Plan - January 2024"
    },
    {
      id: "inv_002",
      date: "2023-12-15",
      amount: "$79.00",
      status: "paid",
      description: "Professional Plan - December 2023"
    },
    {
      id: "inv_003",
      date: "2023-11-15",
      amount: "$79.00",
      status: "paid",
      description: "Professional Plan - November 2023"
    }
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <Header 
          title="Billing & Subscription"
          subtitle="Manage your subscription and billing information"
        />

        {/* Current Plan */}
        <Card className="glass-effect border-border/50 mb-8 animate-slide-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Current Plan</h2>
              <Button 
                variant="outline" 
                className="border-primary/50 hover:bg-primary/10"
                onClick={() => window.location.href = "/subscribe"}
                data-testid="button-change-plan"
              >
                Change Plan
              </Button>
            </div>
            
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                    <Crown className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground" data-testid="text-current-plan">
                      {plans.find(p => p.id === currentPlan)?.name || "Professional"} Plan
                    </h3>
                    <p className="text-muted-foreground">
                      Next billing: {nextBillingDate}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">
                    {plans.find(p => p.id === currentPlan)?.price || "$79"}
                  </div>
                  <p className="text-sm text-muted-foreground">per month</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="glass-effect border-border/50 mb-8 animate-slide-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Payment Method</h2>
              <Button variant="outline" className="border-border hover:bg-secondary/50" data-testid="button-update-payment">
                Update Payment Method
              </Button>
            </div>
            
            <div className="bg-secondary/30 border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Visa ending in 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/2026</p>
                  </div>
                </div>
                <Badge variant="secondary">Default</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Plans */}
        <Card className="glass-effect border-border/50 mb-8 animate-slide-in">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Available Plans</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan, index) => (
                <div 
                  key={plan.id}
                  className={`border rounded-lg p-6 transition-all duration-200 hover:border-primary/50 ${
                    plan.popular ? 'border-2 border-primary relative' : 'border-border'
                  } ${currentPlan === plan.id ? 'bg-primary/5' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-1 text-sm font-semibold rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      {plan.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{plan.name}</h3>
                    <div className="text-2xl font-bold text-primary mb-1">{plan.price}</div>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${
                      currentPlan === plan.id 
                        ? 'bg-secondary text-secondary-foreground cursor-not-allowed' 
                        : plan.popular 
                          ? 'bg-gradient-to-r from-primary to-accent hover:opacity-90' 
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                    disabled={currentPlan === plan.id}
                    onClick={() => window.location.href = "/subscribe"}
                    data-testid={`button-select-${plan.id}`}
                  >
                    {currentPlan === plan.id ? 'Current Plan' : `Choose ${plan.name}`}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Billing History */}
        <Card className="glass-effect border-border/50 animate-slide-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Billing History</h2>
              <Button variant="outline" className="border-border hover:bg-secondary/50" data-testid="button-download-all">
                <Download className="w-4 h-4 mr-2" />
                Download All
              </Button>
            </div>
            
            <div className="space-y-4">
              {mockInvoices.map((invoice, index) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground" data-testid={`text-invoice-description-${index}`}>{invoice.description}</p>
                      <p className="text-sm text-muted-foreground">{invoice.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Badge>
                    <span className="font-semibold text-foreground">{invoice.amount}</span>
                    <Button size="sm" variant="outline" className="border-border hover:bg-secondary/50" data-testid={`button-download-invoice-${index}`}>
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
