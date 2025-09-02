import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, BarChart3, Zap, Users, Shield } from "lucide-react";

export default function Landing() {
  const plans = [
    {
      name: "Starter",
      price: "$29",
      description: "Perfect for small businesses",
      features: [
        "Up to 10 campaigns",
        "2 connected accounts",
        "Basic analytics",
        "Email support"
      ]
    },
    {
      name: "Professional",
      price: "$79",
      description: "Most popular for growing companies",
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
      name: "Enterprise",
      price: "$199",
      description: "For large organizations",
      features: [
        "Unlimited campaigns",
        "Unlimited accounts",
        "Custom analytics",
        "Advanced permissions",
        "24/7 dedicated support"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 py-20 text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6">
              AdCampaign Pro
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Manage your social media advertising campaigns across all platforms with our sophisticated, enterprise-grade dashboard
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 px-8 py-4 text-lg font-semibold hover-glow"
                onClick={() => window.location.href = '/api/login'}
                data-testid="button-get-started"
              >
                Get Started Free
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-4 text-lg font-semibold border-primary/50 hover:bg-primary/10"
                data-testid="button-view-demo"
              >
                View Demo
              </Button>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full floating-animation" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-20 w-16 h-16 bg-accent/20 rounded-full floating-animation" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-primary/30 rounded-full floating-animation" style={{ animationDelay: '4s' }} />
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need to scale your ads
            </h2>
            <p className="text-xl text-muted-foreground">
              Powerful features designed for modern marketing teams
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="glass-effect border-border/50 hover-glow animate-slide-in" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Advanced Analytics</h3>
                <p className="text-muted-foreground">Real-time insights and performance tracking across all platforms</p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-border/50 hover-glow animate-slide-in" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Multi-Platform</h3>
                <p className="text-muted-foreground">Connect Google Ads, Facebook, Instagram, and YouTube in one dashboard</p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-border/50 hover-glow animate-slide-in" style={{ animationDelay: '0.3s' }}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Team Collaboration</h3>
                <p className="text-muted-foreground">Role-based permissions and seamless team workflow management</p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-border/50 hover-glow animate-slide-in" style={{ animationDelay: '0.4s' }}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Enterprise Security</h3>
                <p className="text-muted-foreground">OAuth 2.0 security with encrypted token storage and management</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-muted-foreground">
              Select the perfect plan for your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={plan.name} 
                className={`glass-effect border-border/50 hover-glow animate-slide-in relative ${
                  plan.popular ? 'border-2 border-primary' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-1 text-sm font-semibold rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold text-primary mb-1">{plan.price}</div>
                    <p className="text-muted-foreground">per month</p>
                    <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-foreground">
                        <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full py-3 font-medium transition-all duration-200 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-primary to-accent hover:opacity-90 hover-glow' 
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                    onClick={() => window.location.href = '/api/login'}
                    data-testid={`button-choose-${plan.name.toLowerCase()}`}
                  >
                    Choose {plan.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-muted-foreground">All plans include 14-day free trial • No setup fees • Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold gradient-text">AdCampaign Pro</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 AdCampaign Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
