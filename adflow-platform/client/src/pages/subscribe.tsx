import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, Crown, Zap, Users } from "lucide-react";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  console.warn('VITE_STRIPE_PUBLIC_KEY not found, using demo key');
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_demo');

const CheckoutForm = ({ selectedPlan, onSuccess, onCancel }: { 
  selectedPlan: any, 
  onSuccess: () => void, 
  onCancel: () => void 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/billing",
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessing(false);
    } else {
      toast({
        title: "Payment Successful",
        description: "Your subscription has been activated!",
      });
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="glass-effect rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Order Summary</h3>
        <div className="flex justify-between items-center">
          <span className="text-foreground">{selectedPlan.name} Plan</span>
          <span className="text-lg font-semibold text-foreground">{selectedPlan.price}/month</span>
        </div>
      </div>

      <div className="glass-effect rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Payment Details</h3>
        <PaymentElement />
      </div>

      <div className="flex space-x-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="flex-1 border-border hover:bg-secondary/50"
          data-testid="button-cancel-payment"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          type="submit" 
          disabled={!stripe || isProcessing}
          className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
          data-testid="button-complete-payment"
        >
          {isProcessing ? "Processing..." : `Subscribe to ${selectedPlan.name}`}
        </Button>
      </div>
    </form>
  );
};

export default function Subscribe() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState("");
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  const createSubscriptionMutation = useMutation({
    mutationFn: async (planId: string) => {
      const response = await apiRequest("POST", "/api/create-subscription", { 
        priceId: `price_${planId}` // This would be actual Stripe price IDs
      });
      return response.json();
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to create subscription",
        variant: "destructive",
      });
    },
  });

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-effect rounded-xl p-8 animate-fade-in">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan);
    createSubscriptionMutation.mutate(plan.id);
  };

  const handlePaymentSuccess = () => {
    window.location.href = "/billing";
  };

  const handleCancel = () => {
    setSelectedPlan(null);
    setClientSecret("");
  };

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold gradient-text mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground">Select the perfect plan for your business needs</p>
        </div>

        {!selectedPlan ? (
          /* Plan Selection */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card 
                key={plan.id}
                className={`glass-effect border-border/50 hover-glow animate-slide-in relative transition-all duration-200 ${
                  plan.popular ? 'border-2 border-primary' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-1 font-semibold">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      {plan.icon}
                    </div>
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
                    onClick={() => handlePlanSelect(plan)}
                    disabled={createSubscriptionMutation.isPending}
                    data-testid={`button-select-${plan.id}`}
                  >
                    {createSubscriptionMutation.isPending ? "Setting up..." : `Choose ${plan.name}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Payment Form */
          clientSecret && (
            <div className="max-w-2xl mx-auto animate-fade-in">
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm 
                  selectedPlan={selectedPlan}
                  onSuccess={handlePaymentSuccess}
                  onCancel={handleCancel}
                />
              </Elements>
            </div>
          )
        )}

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            All plans include 14-day free trial • No setup fees • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
