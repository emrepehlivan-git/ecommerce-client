import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Bell, 
  Users, 
  ShoppingCart, 
  AlertTriangle,
  TrendingUp,
  Activity
} from 'lucide-react';
import { getApiV1DashboardStats, getApiV1DashboardRecentActivity } from '@/api/generated/dashboard/dashboard';

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  lowStockItems: number;
  userGrowthPercentage: number;
  orderGrowthPercentage: number;
  revenueGrowthPercentage: number;
  lowStockGrowthPercentage: number;
}

interface RecentActivity {
  type: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  timestamp: string;
}

async function getDashboardData(): Promise<{
  stats: DashboardStats;
  activities: RecentActivity[];
}> {
  try {
    const [stats, activities] = await Promise.all([
      getApiV1DashboardStats(),
      getApiV1DashboardRecentActivity()
    ]);

    return {
      stats: stats || {
        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        lowStockItems: 0,
        userGrowthPercentage: 0,
        orderGrowthPercentage: 0,
        revenueGrowthPercentage: 0,
        lowStockGrowthPercentage: 0
      },
      activities: activities || []
    };
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    return {
      stats: {
        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        lowStockItems: 0,
        userGrowthPercentage: 0,
        orderGrowthPercentage: 0,
        revenueGrowthPercentage: 0,
        lowStockGrowthPercentage: 0
      },
      activities: []
    };
  }
}

export default async function AdminPage() {
  const { stats, activities } = await getDashboardData();

  const statsData = [
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      change: `${stats.orderGrowthPercentage > 0 ? '+' : ''}${stats.orderGrowthPercentage}%`,
      trend: stats.orderGrowthPercentage >= 0 ? 'up' : 'down'
    },
    {
      title: 'Active Users',
      value: stats.totalUsers.toLocaleString(),
      change: `${stats.userGrowthPercentage > 0 ? '+' : ''}${stats.userGrowthPercentage}%`,
      trend: stats.userGrowthPercentage >= 0 ? 'up' : 'down'
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems.toString(),
      change: `${stats.lowStockGrowthPercentage > 0 ? '+' : ''}${stats.lowStockGrowthPercentage}%`,
      trend: stats.lowStockGrowthPercentage >= 0 ? 'up' : 'down'
    },
    {
      title: 'Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: `${stats.revenueGrowthPercentage > 0 ? '+' : ''}${stats.revenueGrowthPercentage}%`,
      trend: stats.revenueGrowthPercentage >= 0 ? 'up' : 'down'
    }
  ];

  const getIconForActivity = (icon: string) => {
    switch (icon) {
      case 'ShoppingCart': return ShoppingCart;
      case 'Users': return Users;
      case 'AlertTriangle': return AlertTriangle;
      default: return Bell;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h3 className="text-3xl font-bold mb-2">Admin Dashboard</h3>
        <p className="text-muted-foreground">
          Overview of your e-commerce platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`flex items-center text-sm ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className="size-4 mr-1" />
                  {stat.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="size-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest system events and notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No recent activity
              </p>
            ) : (
              activities.map((activity, index) => {
                const IconComponent = getIconForActivity(activity.icon);
                return (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <IconComponent className={`size-4 ${activity.color}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
  }