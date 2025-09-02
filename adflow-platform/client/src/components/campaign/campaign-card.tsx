import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MoreHorizontal, Edit, Trash2, Play, Pause, BarChart3 } from "lucide-react";
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

interface CampaignCardProps {
  campaign: any;
  onDelete: (id: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function CampaignCard({ campaign, onDelete, className, style }: CampaignCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const IconComponent = platformIcons[campaign.platform as keyof typeof platformIcons];
  const gradientClass = platformColors[campaign.platform as keyof typeof platformColors];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'paused': return 'bg-yellow-500/20 text-yellow-400';
      case 'draft': return 'bg-gray-500/20 text-gray-400';
      case 'completed': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  // Mock performance data
  const mockMetrics = {
    impressions: Math.floor(Math.random() * 100000 + 10000),
    clicks: Math.floor(Math.random() * 5000 + 500),
    ctr: (Math.random() * 5 + 1).toFixed(1),
    roas: (Math.random() * 3 + 2).toFixed(1),
  };

  return (
    <>
      <Card className={`glass-effect border-border/50 hover-glow transition-all duration-200 ${className}`} style={style}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${gradientClass} rounded-lg flex items-center justify-center`}>
                {IconComponent && <IconComponent className="w-5 h-5 text-white" />}
              </div>
              <div>
                <h3 className="font-semibold text-foreground" data-testid={`text-campaign-name-${campaign.id}`}>
                  {campaign.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {campaign.platform} • {campaign.campaignType}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className={`${getStatusColor(campaign.status)} border-0`} data-testid={`badge-status-${campaign.id}`}>
                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              </Badge>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" data-testid={`button-menu-${campaign.id}`}>
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-effect border-border">
                  <DropdownMenuItem className="text-foreground hover:bg-secondary/50" data-testid={`button-edit-${campaign.id}`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Campaign
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-foreground hover:bg-secondary/50" data-testid={`button-analytics-${campaign.id}`}>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-foreground hover:bg-secondary/50" data-testid={`button-toggle-${campaign.id}`}>
                    {campaign.status === 'active' ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Pause Campaign
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Resume Campaign
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => setShowDeleteDialog(true)}
                    data-testid={`button-delete-${campaign.id}`}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Campaign
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Campaign Metrics */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Impressions</p>
              <p className="font-semibold text-foreground" data-testid={`text-impressions-${campaign.id}`}>
                {mockMetrics.impressions.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Clicks</p>
              <p className="font-semibold text-foreground" data-testid={`text-clicks-${campaign.id}`}>
                {mockMetrics.clicks.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">CTR</p>
              <p className="font-semibold text-foreground" data-testid={`text-ctr-${campaign.id}`}>
                {mockMetrics.ctr}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">ROAS</p>
              <p className="font-semibold text-green-400" data-testid={`text-roas-${campaign.id}`}>
                {mockMetrics.roas}x
              </p>
            </div>
          </div>

          {/* Campaign Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Daily Budget:</span>
              <span className="text-foreground font-medium" data-testid={`text-budget-${campaign.id}`}>
                ${campaign.dailyBudget || "Not set"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created:</span>
              <span className="text-foreground">
                {new Date(campaign.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="glass-effect border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">Delete Campaign</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete "{campaign.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border hover:bg-secondary/50" data-testid={`button-cancel-delete-${campaign.id}`}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                onDelete(campaign.id);
                setShowDeleteDialog(false);
              }}
              data-testid={`button-confirm-delete-${campaign.id}`}
            >
              Delete Campaign
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
