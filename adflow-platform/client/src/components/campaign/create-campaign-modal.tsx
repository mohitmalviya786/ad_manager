import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { insertCampaignSchema } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { z } from "zod";

const createCampaignFormSchema = insertCampaignSchema.extend({
  name: z.string().min(1, "Campaign name is required"),
  platform: z.string().min(1, "Platform is required"),
  campaignType: z.string().min(1, "Campaign type is required"),
  dailyBudget: z.string().optional(),
  targetAudience: z.string().optional(),
});

type CreateCampaignFormData = z.infer<typeof createCampaignFormSchema>;

interface CreateCampaignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  adAccounts: any[];
}

export default function CreateCampaignModal({ open, onOpenChange, adAccounts }: CreateCampaignModalProps) {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const { toast } = useToast();

  const form = useForm<CreateCampaignFormData>({
    resolver: zodResolver(createCampaignFormSchema),
    defaultValues: {
      name: "",
      platform: "",
      campaignType: "",
      dailyBudget: "",
      targetAudience: "",
      status: "draft",
    },
  });

  const createCampaignMutation = useMutation({
    mutationFn: async (data: CreateCampaignFormData) => {
      const selectedAccount = adAccounts.find(acc => acc.platform === data.platform);
      if (!selectedAccount) {
        throw new Error("No connected account found for selected platform");
      }

      const campaignData = {
        ...data,
        adAccountId: selectedAccount.id,
        dailyBudget: data.dailyBudget ? parseFloat(data.dailyBudget) : undefined,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
      };

      const response = await apiRequest("POST", "/api/campaigns", campaignData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      onOpenChange(false);
      form.reset();
      setStartDate(undefined);
      setEndDate(undefined);
      toast({
        title: "Campaign Created",
        description: "Your campaign has been created successfully",
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
        title: "Creation Failed",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateCampaignFormData) => {
    createCampaignMutation.mutate(data);
  };

  const getCampaignTypes = (platform: string) => {
    switch (platform) {
      case "google":
        return ["Search Campaign", "Display Campaign", "Shopping Campaign", "Video Campaign"];
      case "facebook":
        return ["Traffic Campaign", "Conversions Campaign", "Brand Awareness Campaign", "Lead Generation Campaign"];
      case "instagram":
        return ["Photo Ads", "Video Ads", "Carousel Ads", "Stories Ads"];
      case "youtube":
        return ["Skippable Video Ads", "Non-skippable Video Ads", "Bumper Ads", "Video Discovery Ads"];
      default:
        return [];
    }
  };

  const selectedPlatform = form.watch("platform");
  const availableAccounts = adAccounts.filter(acc => acc.isConnected);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-effect border-border max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl">Create New Campaign</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Campaign Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter campaign name"
                        {...field}
                        className="bg-input border-border"
                        data-testid="input-campaign-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Platform</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-input border-border" data-testid="select-platform">
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableAccounts.map((account) => (
                          <SelectItem key={account.id} value={account.platform}>
                            {account.platform === "google" && "Google Ads"}
                            {account.platform === "facebook" && "Facebook Ads"}
                            {account.platform === "instagram" && "Instagram Ads"}
                            {account.platform === "youtube" && "YouTube Ads"}
                          </SelectItem>
                        ))}
                        {availableAccounts.length === 0 && (
                          <SelectItem value="" disabled>
                            No connected accounts
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="campaignType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Campaign Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-input border-border" data-testid="select-campaign-type">
                          <SelectValue placeholder="Select campaign type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getCampaignTypes(selectedPlatform).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                        {!selectedPlatform && (
                          <SelectItem value="" disabled>
                            Select platform first
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dailyBudget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Daily Budget ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        {...field}
                        className="bg-input border-border"
                        data-testid="input-daily-budget"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Start Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-input border-border"
                      data-testid="button-start-date"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 glass-effect border-border">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">End Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-input border-border"
                      data-testid="button-end-date"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Pick end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 glass-effect border-border">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <FormField
              control={form.control}
              name="targetAudience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Target Audience</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your target audience..."
                      className="bg-input border-border resize-none h-24"
                      {...field}
                      data-testid="textarea-target-audience"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="border-border hover:bg-secondary/50"
                data-testid="button-cancel-campaign"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                disabled={createCampaignMutation.isPending}
                data-testid="button-create-campaign"
              >
                {createCampaignMutation.isPending ? "Creating..." : "Create Campaign"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
