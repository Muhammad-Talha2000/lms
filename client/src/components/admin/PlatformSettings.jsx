import react, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";


const PlatformSettings = () => {
  const [settings, setSettings] = useState({
    branding: "LMS Platform",
    language: "en",
    timeZone: "UTC",
    registration: "open",
    authentication: "email",
    notifications: true,
  });

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    console.log("Saved Settings:", settings);
    alert("Settings saved successfully!");
  };
  return (
    <div className="w-full p-6  mx-auto">
    <h2 className="text-2xl font-bold mb-4">Platform Settings</h2>
    <Tabs defaultValue="general">
      <TabsList className="mb-4">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="users">User Management</TabsTrigger>
        <TabsTrigger value="courses">Courses</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>

      {/* General Settings */}
      <TabsContent value="general">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div>
              <Label>Platform Name</Label>
              <Input value={settings.branding} onChange={(e) => handleChange("branding", e.target.value)} />
            </div>
            <div>
              <Label>Language</Label>
              <Select value={settings.language} onValueChange={(value) => handleChange("language", value)}>
                <SelectTrigger><SelectValue placeholder="Select Language" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Time Zone</Label>
              <Input value={settings.timeZone} onChange={(e) => handleChange("timeZone", e.target.value)} />
            </div>
            <Button className="bg-orange-500" onClick={saveSettings}>Save Changes</Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* User Management */}
      <TabsContent value="users">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div>
              <Label>User Registration</Label>
              <Select value={settings.registration} onValueChange={(value) => handleChange("registration", value)}>
                <SelectTrigger><SelectValue placeholder="Select Option" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="approval">Approval Required</SelectItem>
                  <SelectItem value="invite">Invite Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Authentication Method</Label>
              <Select value={settings.authentication} onValueChange={(value) => handleChange("authentication", value)}>
                <SelectTrigger><SelectValue placeholder="Select Method" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email & Password</SelectItem>
                  <SelectItem value="sso">Single Sign-On</SelectItem>
                  <SelectItem value="social">Social Login</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="bg-orange-500" onClick={saveSettings}>Save Changes</Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Security Settings */}
      <TabsContent value="security">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label>Enable Notifications</Label>
              <Switch checked={settings.notifications} onCheckedChange={(value) => handleChange("notifications", value)} />
            </div>
            <Button className="bg-orange-500" onClick={saveSettings}>Save Changes</Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
  )
}

export default PlatformSettings