import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  BellRing, 
  PieChart, 
  Link as LinkIcon, 
  Users, 
  CreditCard,
  Settings,
  LogOut
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Campaigns", href: "/campaigns", icon: BellRing },
  { name: "Analytics", href: "/analytics", icon: PieChart },
  { name: "Connected Accounts", href: "/accounts", icon: LinkIcon },
  { name: "Team", href: "/team", icon: Users },
  { name: "Billing", href: "/billing", icon: CreditCard },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const getInitials = (user: any) => {
    if (!user) return "U";
    const firstName = user?.firstName || "";
    const lastName = user?.lastName || "";
    return (firstName.charAt(0) + lastName.charAt(0)) || user?.email?.charAt(0).toUpperCase() || "U";
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 glass-effect border-r border-border z-50 custom-scrollbar overflow-y-auto">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold gradient-text">AdCampaign Pro</span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="px-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          
          return (
            <Link key={item.name} href={item.href}>
              <a 
                className={cn(
                  "flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-secondary/50",
                  isActive 
                    ? "nav-active text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
                data-testid={`nav-${item.name.toLowerCase().replace(" ", "-")}`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.name}</span>
              </a>
            </Link>
          );
        })}
      </nav>
      
      {/* User Profile */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="glass-effect rounded-xl p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-sm" data-testid="text-user-initials">
                {getInitials(user)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate" data-testid="text-user-name">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}` 
                  : user?.email || "User"
                }
              </p>
              <p className="text-xs text-muted-foreground truncate" data-testid="text-user-plan">
                {user?.subscriptionPlan ? 
                  `${user.subscriptionPlan.charAt(0).toUpperCase()}${user.subscriptionPlan.slice(1)} Plan` : 
                  "Starter Plan"
                }
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 border-border hover:bg-secondary/50 text-xs"
              data-testid="button-settings"
            >
              <Settings className="w-3 h-3 mr-1" />
              Settings
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-destructive/50 hover:bg-destructive/10 text-destructive text-xs"
              onClick={() => window.location.href = "/api/logout"}
              data-testid="button-logout"
            >
              <LogOut className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
