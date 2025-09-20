'use client';

import { useState, useMemo } from 'react';
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
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Clock, 
  AlertTriangle,
  Star,
  Target,
  Users,
  Zap
} from 'lucide-react';

export default function PersonnelPerformance() {
  const { technicians, parts } = useStore();
  const [selectedMetric, setSelectedMetric] = useState<'efficiency' | 'repairTime' | 'scrapRate'>('efficiency');
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('week');

  // Calculate performance data
  const performanceData = useMemo(() => {
    return technicians.map(tech => {
      const assignedParts = parts.filter(p => p.assignedTechnician === tech.id);
      const completedParts = assignedParts.filter(p => p.status === 'repaired' || p.status === 'shipped');
      const scrappedParts = assignedParts.filter(p => p.status === 'scrap');
      
      return {
        name: tech.name,
        efficiency: tech.stats.efficiency,
        avgRepairTime: tech.stats.avgRepairTime,
        scrapRate: tech.stats.scrapRate,
        repairedCount: tech.stats.repairedCount[timeframe],
        hoursWorked: tech.stats.hoursWorked[timeframe],
        onTimeDelivery: tech.stats.onTimeDelivery,
        badges: tech.badges.length,
        utilization: (tech.stats.hoursWorked[timeframe] / (8 * (timeframe === 'today' ? 1 : timeframe === 'week' ? 7 : 30))) * 100
      };
    });
  }, [technicians, parts, timeframe]);

  // Top performers
  const topPerformers = useMemo(() => {
    return [...performanceData]
      .sort((a, b) => b.efficiency - a.efficiency)
      .slice(0, 3);
  }, [performanceData]);

  // Performance alerts
  const alerts = useMemo(() => {
    const alertsList: { type: string; message: string; technician: string }[] = [];
    
    technicians.forEach(tech => {
      if (tech.stats.scrapRate > 10) {
        alertsList.push({
          type: 'warning',
          message: `${tech.name} has high scrap rate: ${tech.stats.scrapRate}%`,
          technician: tech.name
        });
      }
      
      if (tech.stats.avgRepairTime > 10) {
        alertsList.push({
          type: 'warning',
          message: `${tech.name} has long average repair time: ${tech.stats.avgRepairTime}h`,
          technician: tech.name
        });
      }
      
      if (tech.stats.efficiency < 70) {
        alertsList.push({
          type: 'error',
          message: `${tech.name} has low efficiency: ${tech.stats.efficiency}%`,
          technician: tech.name
        });
      }
    });
    
    return alertsList;
  }, [technicians]);

  const getMetricColor = (value: number, metric: string) => {
    switch (metric) {
      case 'efficiency':
        return value >= 80 ? '#10b981' : value >= 60 ? '#f59e0b' : '#ef4444';
      case 'repairTime':
        return value <= 6 ? '#10b981' : value <= 8 ? '#f59e0b' : '#ef4444';
      case 'scrapRate':
        return value <= 5 ? '#10b981' : value <= 10 ? '#f59e0b' : '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const pieData = [
    { name: 'High Performers', value: performanceData.filter(p => p.efficiency >= 80).length, color: '#10b981' },
    { name: 'Average Performers', value: performanceData.filter(p => p.efficiency >= 60 && p.efficiency < 80).length, color: '#f59e0b' },
    { name: 'Needs Improvement', value: performanceData.filter(p => p.efficiency < 60).length, color: '#ef4444' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Personnel Performance</h2>
        <div className="flex gap-4">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="efficiency">Efficiency</option>
            <option value="repairTime">Repair Time</option>
            <option value="scrapRate">Scrap Rate</option>
          </select>
        </div>
      </div>

      {/* Performance Alerts */}
      {alerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <h3 className="font-semibold text-red-800">Performance Alerts</h3>
          </div>
          <div className="space-y-1">
            {alerts.map((alert, index) => (
              <div key={index} className="text-sm text-red-700">
                • {alert.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Performers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topPerformers.map((performer, index) => (
          <div key={performer.name} className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                {index === 0 && <Star className="w-6 h-6 text-yellow-500" />}
                {index === 1 && <Award className="w-6 h-6 text-gray-400" />}
                {index === 2 && <Award className="w-6 h-6 text-orange-400" />}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{performer.name}</h3>
                <p className="text-sm text-gray-600">#{index + 1} Performer</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Efficiency:</span>
                <span className="text-sm font-medium text-gray-900">{performer.efficiency}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Repaired ({timeframe}):</span>
                <span className="text-sm font-medium text-gray-900">{performer.repairedCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">On-time:</span>
                <span className="text-sm font-medium text-gray-900">{performer.onTimeDelivery}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Badges:</span>
                <span className="text-sm font-medium text-gray-900">{performer.badges}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Bar Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {selectedMetric === 'efficiency' ? 'Efficiency' : 
             selectedMetric === 'repairTime' ? 'Average Repair Time' : 'Scrap Rate'} by Technician
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey={selectedMetric}>
                {performanceData.map((entry, index) => {
                  const value = selectedMetric === 'repairTime' ? entry.avgRepairTime : entry[selectedMetric];
                  return (
                    <Cell key={`cell-${index}`} fill={getMetricColor(value, selectedMetric)} />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Distribution Pie Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Performance Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Performance Metrics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Technician
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Efficiency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Repair Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scrap Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  On-time Delivery
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours Worked
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Badges
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {performanceData.map((tech) => (
                <tr key={tech.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {tech.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: getMetricColor(tech.efficiency, 'efficiency') + '20',
                        color: getMetricColor(tech.efficiency, 'efficiency')
                      }}
                    >
                      {tech.efficiency}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: getMetricColor(tech.avgRepairTime, 'repairTime') + '20',
                        color: getMetricColor(tech.avgRepairTime, 'repairTime')
                      }}
                    >
                      {tech.avgRepairTime}h
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: getMetricColor(tech.scrapRate, 'scrapRate') + '20',
                        color: getMetricColor(tech.scrapRate, 'scrapRate')
                      }}
                    >
                      {tech.scrapRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tech.onTimeDelivery}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tech.hoursWorked}h
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${Math.min(tech.utilization, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{tech.utilization.toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex flex-wrap gap-1">
                      {Array.from({ length: tech.badges }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500" />
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

