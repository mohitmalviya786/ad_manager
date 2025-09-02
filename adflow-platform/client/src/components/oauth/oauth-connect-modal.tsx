import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SiGoogle, SiFacebook, SiInstagram, SiYoutube } from "react-icons/si";
import { LinkIcon, Shield } from "lucide-react";

const platforms = [
  {
    id: "google",
    name: "Google Ads",
    icon: SiGoogle,
    color: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
    description: "Connect your Google Ads account"
  },
  {
    id: "facebook", 
    name: "Facebook Ads",
    icon: SiFacebook,
    color: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
    description: "Connect your Facebook Business account"
  },
  {
    id: "instagram",
    name: "Instagram Ads", 
    icon: SiInstagram,
    color: "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700",
    description: "Connect your Instagram Business account"
  },
  {
    id: "youtube",
    name: "YouTube Ads",
    icon: SiYoutube, 
    color: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
    description: "Connect your YouTube channel"
  }
];

interface OAuthConnectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: (platform: string) => void;
  isConnecting: boolean;
}

export default function OAuthConnectModal({ 
  open, 
  onOpenChange, 
  onConnect, 
  isConnecting 
}: OAuthConnectModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-effect border-border max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
              <LinkIcon className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <DialogTitle className="text-xl font-bold text-foreground text-center">
            Connect Ad Account
          </DialogTitle>
          <p className="text-muted-foreground text-center mt-2">
            Securely connect your advertising accounts via OAuth
          </p>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          {platforms.map((platform) => {
            const IconComponent = platform.icon;
            
            return (
              <Button
                key={platform.id}
                className={`w-full h-14 ${platform.color} text-white font-medium transition-all duration-200 hover-glow`}
                onClick={() => onConnect(platform.id)}
                disabled={isConnecting}
                data-testid={`button-connect-${platform.id}`}
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-semibold">{platform.name}</div>
                    <div className="text-sm opacity-90">{platform.description}</div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-center space-x-2 text-center">
            <Shield className="w-4 h-4 text-green-400" />
            <p className="text-xs text-muted-foreground">
              Your credentials are secured with OAuth 2.0 encryption
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
