import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useSettingsStore } from "@/store/settingsStore";
import { toast } from "sonner";

export default function Settings() {
  const { lowStockThreshold, setLowStockThreshold } = useSettingsStore();

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setLowStockThreshold(value);
      toast.success("Low stock threshold updated");
    }
  };

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your application preferences</p>
      </div>

      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize how the application looks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="theme">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark themes
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure general application settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable system notifications
                  </p>
                </div>
                <Switch id="notifications" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="threshold">Low Stock Threshold</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Set the minimum stock level for low stock alerts
                </p>
                <Input
                  id="threshold"
                  type="number"
                  min="0"
                  value={lowStockThreshold}
                  onChange={handleThresholdChange}
                  className="max-w-[200px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}