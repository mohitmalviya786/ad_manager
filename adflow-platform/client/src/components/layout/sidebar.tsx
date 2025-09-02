
import { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { 
  LayoutDashboard, 
  Target, 
  BarChart3, 
  Users, 
  Settings,
  CreditCard,
  Link as LinkIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { SiGoogle, SiFacebook, SiInstagram, SiYoutube } from 'react-icons/si';
import { cn } from '../../lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, current: true },
  { name: 'Campaigns', href: '/campaigns', icon: Target, current: false },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, current: false },
  { name: 'Ad Accounts', href: '/accounts', icon: LinkIcon, current: false },
  { name: 'Team', href: '/team', icon: Users, current: false },
  { name: 'Billing', href: '/billing', icon: CreditCard, current: false },
  { name: 'Settings', href: '/settings', icon: Settings, current: false },
];

const connectedPlatforms = [
  { name: 'Google Ads', icon: SiGoogle, connected: true, campaigns: 5 },
  { name: 'Facebook Ads', icon: SiFacebook, connected: true, campaigns: 3 },
  { name: 'Instagram Ads', icon: SiInstagram, connected: false, campaigns: 0 },
  { name: 'YouTube Ads', icon: SiYoutube, connected: false, campaigns: 0 },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div
      className={cn(
        "relative flex flex-col h-full bg-card border-r transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-xl gradient-text">AdFlow</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-8 w-8 p-0"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.name}
                variant={item.current ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  collapsed ? "px-2" : "px-3",
                  item.current && "gradient-primary text-white hover:opacity-90"
                )}
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
                {!collapsed && <span>{item.name}</span>}
                {collapsed && hoveredItem === item.name && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-popover border rounded-md shadow-md z-50 whitespace-nowrap">
                    {item.name}
                  </div>
                )}
              </Button>
            );
          })}
        </nav>

        {/* Connected Platforms */}
        {!collapsed && (
          <div className="p-4 mt-4 border-t">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              Connected Platforms
            </h3>
            <div className="space-y-2">
              {connectedPlatforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <div
                    key={platform.name}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {platform.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {platform.connected ? (
                        <>
                          <Badge variant="secondary" className="text-xs">
                            {platform.campaigns}
                          </Badge>
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                        </>
                      ) : (
                        <Button variant="outline" size="sm" className="text-xs px-2 py-1">
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Usage Stats */}
      {!collapsed && (
        <div className="p-4 border-t">
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Monthly Spend</span>
              <span className="font-semibold">$4,567</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Active Campaigns</span>
              <span className="font-semibold">8</span>
            </div>
            <div className="pt-2">
              <div className="w-full bg-muted rounded-full h-2">
                <div className="gradient-primary h-2 rounded-full" style={{ width: '65%' }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                65% of monthly budget used
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
