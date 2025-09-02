import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Check, AlertCircle, Info, CheckCircle, XCircle, Bell } from "lucide-react";

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "success": return <CheckCircle className="w-5 h-5 text-green-400" />;
    case "error": return <XCircle className="w-5 h-5 text-red-400" />;
    case "warning": return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    default: return <Info className="w-5 h-5 text-blue-400" />;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case "success": return "border-green-500/20 bg-green-500/5";
    case "error": return "border-red-500/20 bg-red-500/5";
    case "warning": return "border-yellow-500/20 bg-yellow-500/5";
    default: return "border-blue-500/20 bg-blue-500/5";
  }
};

export default function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  const { toast } = useToast();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["/api/notifications"],
    retry: false,
    enabled: open,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      await apiRequest("PUT", `/api/notifications/${notificationId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
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
    },
  });

  if (!open) return null;

  return (
    <div className="fixed top-20 right-8 w-96 max-h-96 overflow-hidden glass-effect rounded-xl border border-border z-50 animate-slide-in">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="h-8 w-8 hover:bg-secondary/50"
          data-testid="button-close-notifications"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="max-h-80 overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="p-6 text-center">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">Loading notifications...</p>
          </div>
        ) : Array.isArray(notifications) && notifications.length > 0 ? (
          <div className="space-y-2 p-2">
            {notifications.map((notification: any, index: number) => (
              <div 
                key={notification.id}
                className={`p-3 rounded-lg border transition-all duration-200 hover:bg-secondary/30 cursor-pointer ${
                  notification.isRead ? 'opacity-60' : ''
                } ${getNotificationColor(notification.type)}`}
                onClick={() => !notification.isRead && markAsReadMutation.mutate(notification.id)}
                data-testid={`notification-${index}`}
              >
                <div className="flex items-start space-x-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-foreground truncate" data-testid={`notification-title-${index}`}>
                        {notification.title}
                      </p>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2" data-testid={`notification-message-${index}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                {!notification.isRead && (
                  <div className="flex justify-end mt-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 text-xs text-primary hover:bg-primary/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsReadMutation.mutate(notification.id);
                      }}
                      data-testid={`button-mark-read-${index}`}
                    >
                      <Check className="w-3 h-3 mr-1" />
                      Mark as read
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No notifications yet</p>
          </div>
        )}
      </div>

      {notifications && notifications.length > 0 && (
        <div className="p-4 border-t border-border">
          <Button 
            variant="ghost" 
            className="w-full text-primary hover:text-accent transition-colors text-sm"
            data-testid="button-view-all-notifications"
          >
            View All Notifications
          </Button>
        </div>
      )}
    </div>
  );
}
