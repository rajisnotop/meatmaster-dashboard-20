import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useSettingsStore } from "@/store/settingsStore";
import { toast } from "sonner";
import Header from "@/components/Header";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Settings() {
  const { lowStockThreshold, setLowStockThreshold, navStyle, setNavStyle } = useSettingsStore();

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setLowStockThreshold(value);
      toast.success("Low stock threshold updated");
    }
  };

  const handleNavStyleChange = (value: 'top' | 'side') => {
    setNavStyle(value);
    toast.success("Navigation style updated");
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <div className="container mx-auto p-6 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-forest/80">Manage your application preferences</p>
        </div>

        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="mb-6 bg-moss text-cream">
            <TabsTrigger value="appearance" className="data-[state=active]:bg-earth data-[state=active]:text-forest">
              Appearance
            </TabsTrigger>
            <TabsTrigger value="general" className="data-[state=active]:bg-earth data-[state=active]:text-forest">
              General
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-tiger">Appearance Settings</CardTitle>
                <CardDescription className="text-forest/80">
                  Customize how the application looks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="theme">Dark Mode</Label>
                      <p className="text-sm text-forest/80">
                        Toggle between light and dark themes
                      </p>
                    </div>
                    <ThemeToggle />
                  </div>

                  <div className="space-y-4">
                    <Label>Navigation Style</Label>
                    <p className="text-sm text-forest/80 mb-4">
                      Choose how you want the navigation to appear
                    </p>
                    <RadioGroup 
                      value={navStyle} 
                      onValueChange={(value: 'top' | 'side') => handleNavStyleChange(value)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="top" id="top" />
                        <Label htmlFor="top">Top Navigation</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="side" id="side" />
                        <Label htmlFor="side">Side Navigation</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-tiger">General Settings</CardTitle>
                <CardDescription className="text-forest/80">
                  Configure general application settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications">Notifications</Label>
                    <p className="text-sm text-forest/80">
                      Enable or disable system notifications
                    </p>
                  </div>
                  <Switch id="notifications" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="threshold">Low Stock Threshold</Label>
                  <p className="text-sm text-forest/80 mb-2">
                    Set the minimum stock level for low stock alerts
                  </p>
                  <Input
                    id="threshold"
                    type="number"
                    min="0"
                    value={lowStockThreshold}
                    onChange={handleThresholdChange}
                    className="max-w-[200px] bg-cream border-moss/20 focus:border-tiger focus:ring-tiger/20"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}