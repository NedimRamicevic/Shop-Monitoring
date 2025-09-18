'use client';

import { useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  AlertTriangle,
  Package,
  CheckCircle,
  XCircle,
  Truck,
  Activity,
  Target,
  Users
} from 'lucide-react';

export default function ShopAnalytics() {
  const { parts, technicians } = useStore();

  // Calculate shop analytics
  const analytics = useMemo(() => {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const completedToday = parts.filter(p => {
      if (!p.repairCompleted) return false;
      const completedDate = new Date(p.repairCompleted);
      return completedDate >= todayStart;
    }).length;

    const overdueRepairs = parts.filter(p => p.isOverdue).length;

    // Calculate MTTR (Mean Time to Repair)
    const completedParts = parts.filter(p => p.repairStarted && p.repairCompleted);
    const totalRepairTime = completedParts.reduce((sum, part) => {
      const start = new Date(part.repairStarted!).getTime();
      const end = new Date(part.repairCompleted!).getTime();
      return sum + (end - start) / (1000 * 60 * 60); // Convert to hours
    }, 0);
    const mttr = completedParts.length > 0 ? totalRepairTime / completedParts.length : 0;

    // Calculate scrap and shipped rates
    const totalProcessed = parts.filter(p => p.status === 'repaired' || p.status === 'shipped' || p.status === 'scrap').length;
    const scrapRate = totalProcessed > 0 ? (parts.filter(p => p.status === 'scrap').length / totalProcessed) * 100 : 0;
    const shippedRate = totalProcessed > 0 ? (parts.filter(p => p.status === 'shipped').length / totalProcessed) * 100 : 0;

    // Generate backlog trend (last 7 days)
    const backlogTrend = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split('T')[0];
      
      // Count parts that were unrepaired on this date
      const count = parts.filter(p => {
        const enteredDate = new Date(p.enteredShop);
        return enteredDate <= date && (p.status === 'unrepaired' || 
          (p.repairStarted && new Date(p.repairStarted) > date));
      }).length;
      
      return { date: dateStr, count };
    });

    // Workload distribution
    const workloadDistribution = technicians.map(tech => {
      const assignedParts = parts.filter(p => p.assignedTechnician === tech.id && p.status === 'in-repair');
      const totalHours = assignedParts.reduce((sum, part) => sum + (part.estimatedHours || 0), 0);
      return {
        technician: tech.name,
        workload: totalHours
      };
    });

    return {
      totalParts: parts.length,
      completedToday,
      overdueRepairs,
      mttr: Math.round(mttr * 10) / 10,
      scrapRate: Math.round(scrapRate * 10) / 10,
      shippedRate: Math.round(shippedRate * 10) / 10,
      backlogTrend,
      workloadDistribution
    };
  }, [parts, technicians]);

  // Status distribution for pie chart
  const statusDistribution = useMemo(() => {
    const statusCounts = {
      unrepaired: parts.filter(p => p.status === 'unrepaired').length,
      'in-repair': parts.filter(p => p.status === 'in-repair').length,
      repaired: parts.filter(p => p.status === 'repaired').length,
      scrap: parts.filter(p => p.status === 'scrap').length,
      shipped: parts.filter(p => p.status === 'shipped').length,
    };

    return [
      { name: 'Unrepaired', value: statusCounts.unrepaired, color: '#6b7280' },
      { name: 'In Repair', value: statusCounts['in-repair'], color: '#f59e0b' },
      { name: 'Repaired', value: statusCounts.repaired, color: '#10b981' },
      { name: 'Scrap', value: statusCounts.scrap, color: '#ef4444' },
      { name: 'Shipped', value: statusCounts.shipped, color: '#3b82f6' }
    ];
  }, [parts]);

  // Priority distribution
  const priorityDistribution = useMemo(() => {
    const priorityCounts = {
      low: parts.filter(p => p.priority === 'low').length,
      medium: parts.filter(p => p.priority === 'medium').length,
      high: parts.filter(p => p.priority === 'high').length,
      critical: parts.filter(p => p.priority === 'critical').length,
    };

    return [
      { name: 'Low', value: priorityCounts.low, color: '#6b7280' },
      { name: 'Medium', value: priorityCounts.medium, color: '#3b82f6' },
      { name: 'High', value: priorityCounts.high, color: '#f59e0b' },
      { name: 'Critical', value: priorityCounts.critical, color: '#ef4444' }
    ];
  }, [parts]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unrepaired': return '#6b7280';
      case 'in-repair': return '#f59e0b';
      case 'repaired': return '#10b981';
      case 'scrap': return '#ef4444';
      case 'shipped': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Shop Analytics & Health</h2>
        <div className="flex items-center text-sm text-gray-600">
          <Activity className="w-4 h-4 mr-2" />
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
              <Package className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Parts</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalParts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mr-4">
              <CheckCircle className="w-6 h-6 text-success-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Today</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.completedToday}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-danger-100 rounded-lg flex items-center justify-center mr-4">
              <AlertTriangle className="w-6 h-6 text-danger-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue Repairs</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overdueRepairs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mr-4">
              <Clock className="w-6 h-6 text-warning-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Mean Time to Repair</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.mttr}h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Backlog Trend */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Backlog Trend (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics.backlogTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Workload Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Workload Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.workloadDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="technician" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="workload" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityDistribution}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {priorityDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Scrap Rate</h3>
            <XCircle className="w-6 h-6 text-red-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{analytics.scrapRate}%</div>
          <div className="text-sm text-gray-600">
            {analytics.scrapRate < 5 ? (
              <span className="text-green-600 flex items-center">
                <TrendingDown className="w-4 h-4 mr-1" />
                Excellent
              </span>
            ) : analytics.scrapRate < 10 ? (
              <span className="text-yellow-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                Needs Attention
              </span>
            ) : (
              <span className="text-red-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                Critical
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Shipped Rate</h3>
            <Truck className="w-6 h-6 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{analytics.shippedRate}%</div>
          <div className="text-sm text-gray-600">
            {analytics.shippedRate > 80 ? (
              <span className="text-green-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                Excellent
              </span>
            ) : analytics.shippedRate > 60 ? (
              <span className="text-yellow-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                Good
              </span>
            ) : (
              <span className="text-red-600 flex items-center">
                <TrendingDown className="w-4 h-4 mr-1" />
                Needs Improvement
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Shop Health</h3>
            <Target className="w-6 h-6 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {analytics.overdueRepairs === 0 && analytics.scrapRate < 5 ? 'Excellent' :
             analytics.overdueRepairs < 3 && analytics.scrapRate < 10 ? 'Good' : 'Needs Attention'}
          </div>
          <div className="text-sm text-gray-600">
            Based on overdue repairs and scrap rate
          </div>
        </div>
      </div>

      {/* Heatmap of Workload Distribution */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Workload Heatmap</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {technicians.map(tech => {
            const assignedParts = parts.filter(p => p.assignedTechnician === tech.id);
            const inRepairParts = assignedParts.filter(p => p.status === 'in-repair');
            const totalHours = inRepairParts.reduce((sum, part) => sum + (part.estimatedHours || 0), 0);
            const utilization = (totalHours / 8) * 100; // 8 hours daily capacity
            
            return (
              <div key={tech.id} className="text-center">
                <div className="mb-2">
                  <img
                    src={tech.photo}
                    alt={tech.name}
                    className="w-12 h-12 rounded-full object-cover mx-auto"
                  />
                  <p className="text-sm font-medium text-gray-900 mt-2">{tech.name}</p>
                </div>
                <div 
                  className="w-full h-8 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                  style={{
                    backgroundColor: utilization >= 100 ? '#ef4444' :
                                   utilization >= 80 ? '#f59e0b' :
                                   utilization >= 60 ? '#10b981' : '#6b7280'
                  }}
                >
                  {totalHours.toFixed(1)}h
                </div>
                <p className="text-xs text-gray-500 mt-1">{utilization.toFixed(0)}% capacity</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

