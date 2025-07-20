'use client';

import { useState, useEffect } from 'react';
import { useSignalR, NotificationContent } from '@/hooks/useSignalR';
import { NotificationContainer } from '@/components/notifications/notification-container';
import { Bell, Send, Users, AlertTriangle, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Toaster } from '@/components/ui/sonner';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useErrorHandler } from '@/hooks/use-error-handling';

interface NotificationHistory {
  notifications: any[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface NotificationAdminClientProps {
  initialData: NotificationHistory;
}

export function NotificationAdminClient({ initialData }: NotificationAdminClientProps) {
  const { handleError } = useErrorHandler();
  const [notificationHistory, setNotificationHistory] = useState<NotificationContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // System Notification Form
  const [systemForm, setSystemForm] = useState({
    title: '',
    message: '',
    type: 'SystemAlert' as const,
    targetGroup: 'administrators'
  });

  // Announcement Form
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    message: '',
    targetGroup: 'all'
  });

  const handleNotificationReceived = (notification: NotificationContent) => {
    setNotificationHistory(prev => [notification, ...prev.slice(0, 19)]);
    if (typeof window !== 'undefined' && window.addNotification) {
      window.addNotification(notification);
    }
  };

  const { isConnected, isConnecting, error } = useSignalR(
    {
      url: 'http://localhost:4000/notificationHub',
      automaticReconnect: true,
    },
    handleNotificationReceived
  );

  const sendSystemNotification = async () => {
    if (!systemForm.title || !systemForm.message) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/notification/system', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: systemForm.title,
          message: systemForm.message,
          type: systemForm.type,
          targetGroup: systemForm.targetGroup
        }),
      });

      if (response.ok) {
        setSystemForm({ title: '', message: '', type: 'SystemAlert', targetGroup: 'administrators' });
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendAnnouncement = async () => {
    if (!announcementForm.title || !announcementForm.message) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/notification/announcement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: announcementForm.title,
          message: announcementForm.message,
          targetGroup: announcementForm.targetGroup === 'all' ? null : announcementForm.targetGroup
        }),
      });

      if (response.ok) {
        setAnnouncementForm({ title: '', message: '', targetGroup: 'all' });
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getConnectionStatusVariant = () => {
    if (isConnected) return 'success';
    if (isConnecting) return 'warning';
    return 'destructive';
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order_created':
      case 'order_status_changed':
        return <Info className="size-4" />;
      case 'low_stock':
      case 'out_of_stock':
        return <AlertTriangle className="size-4" />;
      case 'announcement':
        return <Users className="size-4" />;
      default:
        return <Bell className="size-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <NotificationContainer />
      <Toaster />

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="size-5" />
            Real-time Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge variant={getConnectionStatusVariant()}>
              {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Disconnected'}
            </Badge>
            {error && (
              <Badge variant="destructive">Error: {error}</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Management Tabs */}
      <Tabs defaultValue="system" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="system">System Notifications</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="size-5" />
                Send System Notification
              </CardTitle>
              <CardDescription>
                Send notifications to administrators or specific user groups
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={systemForm.title}
                    onChange={(e) => setSystemForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Notification title..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select 
                    value={systemForm.type} 
                    onValueChange={(value: any) => setSystemForm(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SystemAlert">System Alert</SelectItem>
                      <SelectItem value="LowStock">Low Stock</SelectItem>
                      <SelectItem value="OutOfStock">Out of Stock</SelectItem>
                      <SelectItem value="OrderCreated">Order Created</SelectItem>
                      <SelectItem value="UserRegistered">User Registered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  value={systemForm.message}
                  onChange={(e) => setSystemForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Notification message..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Target Group</label>
                <Select 
                  value={systemForm.targetGroup} 
                  onValueChange={(value) => setSystemForm(prev => ({ ...prev, targetGroup: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="administrators">Administrators</SelectItem>
                    <SelectItem value="managers">Managers</SelectItem>
                    <SelectItem value="all">All Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={sendSystemNotification}
                disabled={!isConnected || isLoading || !systemForm.title || !systemForm.message}
                className="w-fit"
              >
                <Send className="size-4 mr-2" />
                {isLoading ? 'Sending...' : 'Send System Notification'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="size-5" />
                Send Announcement
              </CardTitle>
              <CardDescription>
                Broadcast announcements to all users or specific groups
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={announcementForm.title}
                  onChange={(e) => setAnnouncementForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Announcement title..."
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  value={announcementForm.message}
                  onChange={(e) => setAnnouncementForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Announcement message..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Target Audience</label>
                <Select 
                  value={announcementForm.targetGroup} 
                  onValueChange={(value) => setAnnouncementForm(prev => ({ ...prev, targetGroup: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="administrators">Administrators Only</SelectItem>
                    <SelectItem value="customers">Customers Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={sendAnnouncement}
                disabled={!isConnected || isLoading || !announcementForm.title || !announcementForm.message}
                className="w-fit"
              >
                <Send className="size-4 mr-2" />
                {isLoading ? 'Sending...' : 'Send Announcement'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>Real-time notification history</CardDescription>
            </CardHeader>
            <CardContent>
              {notificationHistory.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No notifications received yet
                </p>
              ) : (
                <div className="space-y-3">
                  {notificationHistory.map((notification, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getNotificationIcon(notification.type)}
                            <h4 className="font-medium">{notification.title}</h4>
                          </div>
                          <Badge variant="outline">{notification.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        {notification.data && Object.keys(notification.data).length > 0 && (
                          <details className="text-xs text-muted-foreground">
                            <summary className="cursor-pointer">Show Data</summary>
                            <pre className="mt-1 bg-muted p-2 rounded text-xs overflow-x-auto">
                              {JSON.stringify(notification.data, null, 2)}
                            </pre>
                          </details>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}