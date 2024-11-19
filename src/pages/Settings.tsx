import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Bell, Shield, User } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [privacy, setPrivacy] = useState(false);

  const handleToggle = (type: string) => {
    if (type === 'notifications') {
      setNotifications(!notifications);
      toast({
        title: `Notifications ${!notifications ? 'enabled' : 'disabled'}`,
        duration: 2000,
      });
    } else {
      setPrivacy(!privacy);
      toast({
        title: `Enhanced Privacy ${!privacy ? 'enabled' : 'disabled'}`,
        duration: 2000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 space-y-8">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        
        <div className="grid gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Bell className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Notifications</h3>
                  <p className="text-sm text-muted-foreground">Receive notifications about orders and updates</p>
                </div>
              </div>
              <Switch checked={notifications} onCheckedChange={() => handleToggle('notifications')} />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Shield className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="font-semibold">Enhanced Privacy</h3>
                  <p className="text-sm text-muted-foreground">Enable additional privacy features</p>
                </div>
              </div>
              <Switch checked={privacy} onCheckedChange={() => handleToggle('privacy')} />
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;