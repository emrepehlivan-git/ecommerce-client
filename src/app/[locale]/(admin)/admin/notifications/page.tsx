import { Suspense } from 'react';
import { NotificationAdminClient } from '@/components/admin/notifications/notification-admin-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

async function getNotificationHistory() {
  try {
    // This would be replaced with actual API call when authentication is ready
    // const response = await fetch('/api/v1/notification/history', {
    //   headers: { Authorization: `Bearer ${token}` }
    // });
    // return await response.json();
    return {
      notifications: [],
      totalCount: 0,
      page: 1,
      pageSize: 20,
      totalPages: 0
    };
  } catch (error) {
    console.error('Failed to fetch notification history:', error);
    return {
      notifications: [],
      totalCount: 0,
      page: 1,
      pageSize: 20,
      totalPages: 0
    };
  }
}

export default async function NotificationAdminPage() {
  const notificationHistory = await getNotificationHistory();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Notification Management</h1>
        <p className="text-muted-foreground">
          Manage system notifications, announcements, and view notification history
        </p>
      </div>

      <Suspense fallback={<NotificationLoadingSkeleton />}>
        <NotificationAdminClient initialData={notificationHistory} />
      </Suspense>
    </div>
  );
}

function NotificationLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-32" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-32" />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}