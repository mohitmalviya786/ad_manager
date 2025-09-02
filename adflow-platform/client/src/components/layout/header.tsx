import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NotificationPanel from "@/components/notifications/notification-panel";
import { Bell, Plus } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function Header({ title, subtitle, actions }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  const { data: notifications } = useQuery({
    queryKey: ["/api/notifications"],
    retry: false,
  });

  const unreadCount = Array.isArray(notifications) ? notifications.filter((n: any) => !n.isRead).length : 0;

  return (
    <>
      <header className="flex items-center justify-between mb-8 animate-slide-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">{title}</h1>
          {subtitle && (
            <p className="text-muted-foreground mt-1" data-testid="text-page-subtitle">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <Button 
              variant="outline"
              size="icon"
              className="glass-effect border-border hover:bg-secondary/50 relative"
              onClick={() => setShowNotifications(!showNotifications)}
              data-testid="button-notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs animate-pulse-glow"
                  data-testid="badge-notification-count"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
            </Button>
          </div>
          
          {/* Custom Actions */}
          {actions}
        </div>
      </header>

      {/* Notification Panel */}
      <NotificationPanel 
        open={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
}
