import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import CampaignCard from "@/components/campaign/campaign-card";
import CreateCampaignModal from "@/components/campaign/create-campaign-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, Megaphone } from "lucide-react";

export default function Campaigns() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  const { data: campaigns, isLoading: campaignsLoading, error: campaignError } = useQuery({
    queryKey: ["/api/campaigns"],
    retry: false,
  });

  const { data: adAccounts } = useQuery({
    queryKey: ["/api/ad-accounts"],
    retry: false,
  });

  const deleteCampaignMutation = useMutation({
    mutationFn: async (campaignId: string) => {
      await apiRequest("DELETE", `/api/campaigns/${campaignId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      toast({
        title: "Campaign Deleted",
        description: "Campaign has been deleted successfully",
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
        description: "Failed to delete campaign",
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
    if (campaignError && isUnauthorizedError(campaignError)) {
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
  }, [campaignError, toast]);

  if (isLoading || campaignsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-effect rounded-xl p-8 animate-fade-in">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  const filteredCampaigns = Array.isArray(campaigns) ? campaigns.filter((campaign: any) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = platformFilter === "all" || campaign.platform === platformFilter;
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    return matchesSearch && matchesPlatform && matchesStatus;
  }) : [];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <Header 
          title="Campaign Management"
          subtitle="Create, manage, and optimize your advertising campaigns"
          actions={
            <Button 
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 hover-glow"
              onClick={() => setShowCreateModal(true)}
              data-testid="button-create-campaign"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          }
        />

        {/* Filters */}
        <Card className="glass-effect border-border/50 mb-8 animate-slide-in">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search campaigns..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-input border-border"
                    data-testid="input-search-campaigns"
                  />
                </div>
              </div>
              
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-48 bg-input border-border" data-testid="select-platform-filter">
                  <SelectValue placeholder="All Platforms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="google">Google Ads</SelectItem>
                  <SelectItem value="facebook">Facebook Ads</SelectItem>
                  <SelectItem value="instagram">Instagram Ads</SelectItem>
                  <SelectItem value="youtube">YouTube Ads</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-input border-border" data-testid="select-status-filter">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Campaigns Grid */}
        <div className="space-y-6">
          {filteredCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {filteredCampaigns.map((campaign: any, index: number) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  onDelete={(id) => deleteCampaignMutation.mutate(id)}
                  className="animate-slide-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                />
              ))}
            </div>
          ) : (
            <Card className="glass-effect border-border/50 animate-fade-in">
              <CardContent className="p-12 text-center">
                {!Array.isArray(campaigns) || campaigns.length === 0 ? (
                  <>
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                      <Megaphone className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">No campaigns yet</h3>
                    <p className="text-muted-foreground mb-6">Create your first campaign to start managing your ads</p>
                    <Button 
                      className="bg-gradient-to-r from-primary to-accent hover-glow"
                      onClick={() => setShowCreateModal(true)}
                      data-testid="button-create-first-campaign"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Campaign
                    </Button>
                  </>
                ) : (
                  <>
                    <Filter className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No campaigns match your filters</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <CreateCampaignModal 
          open={showCreateModal}
          onOpenChange={setShowCreateModal}
          adAccounts={Array.isArray(adAccounts) ? adAccounts : []}
        />
      </main>
    </div>
  );
}
