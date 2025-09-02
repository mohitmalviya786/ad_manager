import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import OAuthConnectModal from "@/components/oauth/oauth-connect-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ExternalLink, Unlink } from "lucide-react";
import { SiGoogle, SiFacebook, SiInstagram, SiYoutube } from "react-icons/si";

const platformIcons = {
  google: SiGoogle,
  facebook: SiFacebook,
  instagram: SiInstagram,
  youtube: SiYoutube,
};

const platformColors = {
  google: "from-red-500 to-red-600",
  facebook: "from-blue-600 to-blue-700",
  instagram: "from-pink-500 to-purple-600",
  youtube: "from-red-500 to-red-600",
};

export default function Accounts() {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  const { data: adAccounts, isLoading: accountsLoading, error: accountError } = useQuery({
    queryKey: ["/api/ad-accounts"],
    retry: false,
  });

  const connectAccountMutation = useMutation({
    mutationFn: async (platform: string) => {
      const response = await apiRequest("POST", `/api/oauth/connect/${platform}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ad-accounts"] });
      setShowConnectModal(false);
      toast({
        title: "Account Connected",
        description: "Your ad account has been connected successfully",
      });
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
        title: "Connection Failed",
        description: "Failed to connect your ad account",
        variant: "destructive",
      });
    },
  });

  const disconnectAccountMutation = useMutation({
    mutationFn: async (accountId: string) => {
      await apiRequest("DELETE", `/api/ad-accounts/${accountId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ad-accounts"] });
      toast({
        title: "Account Disconnected",
        description: "Your ad account has been disconnected",
      });
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
        description: "Failed to disconnect account",
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

  useEffect(() => {
    if (accountError && isUnauthorizedError(accountError)) {
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
  }, [accountError, toast]);

  if (isLoading || accountsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-effect rounded-xl p-8 animate-fade-in">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <Header 
          title="Connected Accounts"
          subtitle="Manage your social media advertising account connections"
          actions={
            <Button 
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 hover-glow"
              onClick={() => setShowConnectModal(true)}
              data-testid="button-connect-new-account"
            >
              <Plus className="w-4 h-4 mr-2" />
              Connect Account
            </Button>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.isArray(adAccounts) && adAccounts.map((account: any, index: number) => {
            const IconComponent = platformIcons[account.platform as keyof typeof platformIcons];
            const gradientClass = platformColors[account.platform as keyof typeof platformColors];
            
            return (
              <Card key={account.id} className="glass-effect border-border/50 hover-glow animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${gradientClass} rounded-lg flex items-center justify-center`}>
                        {IconComponent && <IconComponent className="w-6 h-6 text-white" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{account.accountName}</h3>
                        <p className="text-sm text-muted-foreground">{account.platform}</p>
                      </div>
                    </div>
                    <Badge variant={account.isConnected ? "default" : "secondary"} data-testid={`badge-status-${account.platform}`}>
                      {account.isConnected ? 'Connected' : 'Disconnected'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account ID:</span>
                      <span className="text-foreground font-mono text-xs">{account.accountId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Sync:</span>
                      <span className="text-foreground">
                        {account.lastSyncAt ? new Date(account.lastSyncAt).toLocaleString() : 'Never'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button size="sm" variant="outline" className="border-primary/50 hover:bg-primary/10" data-testid={`button-view-${account.platform}`}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-destructive/50 hover:bg-destructive/10 text-destructive"
                      onClick={() => disconnectAccountMutation.mutate(account.id)}
                      disabled={disconnectAccountMutation.isPending}
                      data-testid={`button-disconnect-${account.platform}`}
                    >
                      <Unlink className="w-4 h-4 mr-2" />
                      Disconnect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {(!Array.isArray(adAccounts) || adAccounts.length === 0) && (
            <Card className="md:col-span-2 glass-effect border-border/50 animate-fade-in">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Plus className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No connected accounts</h3>
                <p className="text-muted-foreground mb-6">Connect your first advertising account to start managing campaigns</p>
                <Button 
                  className="bg-gradient-to-r from-primary to-accent hover-glow"
                  onClick={() => setShowConnectModal(true)}
                  data-testid="button-connect-first-account"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Connect Your First Account
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <OAuthConnectModal 
          open={showConnectModal}
          onOpenChange={setShowConnectModal}
          onConnect={(platform) => connectAccountMutation.mutate(platform)}
          isConnecting={connectAccountMutation.isPending}
        />
      </main>
    </div>
  );
}
