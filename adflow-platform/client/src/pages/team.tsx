import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTeamMemberSchema } from "@shared/schema";
import { Plus, Mail, Edit, Trash2, Shield, Users, Eye } from "lucide-react";
import { z } from "zod";

const inviteFormSchema = insertTeamMemberSchema.extend({
  email: z.string().email("Please enter a valid email"),
  role: z.enum(["admin", "manager", "analyst"]),
});

type InviteFormData = z.infer<typeof inviteFormSchema>;

export default function Team() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  const { data: teamMembers, isLoading: teamLoading, error: teamError } = useQuery({
    queryKey: ["/api/team"],
    retry: false,
  });

  const form = useForm<InviteFormData>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: "",
      role: "analyst",
      permissions: {},
    },
  });

  const inviteMemberMutation = useMutation({
    mutationFn: async (data: InviteFormData) => {
      const response = await apiRequest("POST", "/api/team", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team"] });
      setShowInviteModal(false);
      form.reset();
      toast({
        title: "Invitation Sent",
        description: "Team member invitation has been sent successfully",
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
        title: "Invitation Failed",
        description: "Failed to send team member invitation",
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
    if (teamError && isUnauthorizedError(teamError)) {
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
  }, [teamError, toast]);

  const onSubmit = (data: InviteFormData) => {
    inviteMemberMutation.mutate(data);
  };

  if (isLoading || teamLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-effect rounded-xl p-8 animate-fade-in">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading team...</p>
        </div>
      </div>
    );
  }

  const rolePermissions = {
    admin: ["Full account access", "Manage team members", "Billing & subscription", "Campaign management", "Analytics & reporting"],
    manager: ["Campaign management", "Analytics & reporting", "Account connections", "Team member viewing"],
    analyst: ["View campaigns", "Analytics & reporting", "Export data", "Read-only access"],
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'manager': return <Users className="w-4 h-4" />;
      case 'analyst': return <Eye className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'default';
      case 'manager': return 'secondary';
      case 'analyst': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <Header 
          title="Team Management"
          subtitle="Manage team members and their permissions"
          actions={
            <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 hover-glow" data-testid="button-invite-member">
                  <Plus className="w-4 h-4 mr-2" />
                  Invite Team Member
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-effect border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Invite Team Member</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">Email Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="colleague@company.com"
                              {...field}
                              className="bg-input border-border"
                              data-testid="input-member-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">Role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-input border-border" data-testid="select-member-role">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="analyst">Analyst</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-4 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowInviteModal(false)}
                        data-testid="button-cancel-invite"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-gradient-to-r from-primary to-accent"
                        disabled={inviteMemberMutation.isPending}
                        data-testid="button-send-invite"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        {inviteMemberMutation.isPending ? "Sending..." : "Send Invitation"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          }
        />

        {/* Team Members List */}
        <Card className="glass-effect border-border/50 mb-8 animate-slide-in">
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-medium text-foreground">Member</th>
                    <th className="text-left p-4 font-medium text-foreground">Role</th>
                    <th className="text-left p-4 font-medium text-foreground">Status</th>
                    <th className="text-left p-4 font-medium text-foreground">Invited</th>
                    <th className="text-left p-4 font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(teamMembers) ? teamMembers.map((member: any, index: number) => (
                    <tr key={member.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                            <span className="text-primary-foreground font-semibold text-sm">
                              {member.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground" data-testid={`text-member-email-${index}`}>{member.email}</p>
                            <p className="text-sm text-muted-foreground">Team Member</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={getRoleBadgeVariant(member.role)} className="flex items-center space-x-1 w-fit">
                          {getRoleIcon(member.role)}
                          <span>{member.role.charAt(0).toUpperCase() + member.role.slice(1)}</span>
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge 
                          variant={member.status === 'active' ? 'default' : member.status === 'pending' ? 'secondary' : 'outline'}
                          data-testid={`badge-member-status-${index}`}
                        >
                          {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {new Date(member.invitedAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="border-border hover:bg-secondary/50" data-testid={`button-edit-member-${index}`}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-destructive/50 hover:bg-destructive/10 text-destructive"
                            data-testid={`button-remove-member-${index}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        No team members yet. Invite your first team member to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Role Permissions Overview */}
        <Card className="glass-effect border-border/50 animate-slide-in">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Role Permissions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(rolePermissions).map(([role, permissions]) => (
                <div key={role} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    {getRoleIcon(role)}
                    <h4 className="font-medium text-foreground capitalize">{role}</h4>
                  </div>
                  <ul className="space-y-1">
                    {permissions.map((permission, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-center">
                        <span className="w-1 h-1 bg-primary rounded-full mr-2" />
                        {permission}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
