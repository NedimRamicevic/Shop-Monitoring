'use client';

import { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { Manager, Part, Technician } from '@/types';
import KanbanBoard from './KanbanBoard';
import PersonnelPerformance from './PersonnelPerformance';
import ShopAnalytics from './ShopAnalytics';
import PartTimeline from './PartTimeline';
import IncomingPartRegistration from './IncomingPartRegistration';
import { 
  Home, 
  Package, 
  Wrench, 
  CheckCircle, 
  XCircle, 
  Truck,
  Users,
  ArrowUpDown,
  Clock,
  TrendingUp,
  Award,
  Calendar,
  MapPin,
  User,
  Star,
  Search,
  Filter,
  ChevronDown,
  Eye,
  X,
  Kanban,
  BarChart3,
  Settings,
  Bell,
  CheckSquare,
  Zap,
  AlertTriangle
} from 'lucide-react';


export interface EnhancedManagerDashboardProps {
  manager: Manager;
  onLogout: () => void;
  onRegisterPart: () => void;
}
export default function EnhancedManagerDashboard({ 
  manager, 
  onLogout, 
  onRegisterPart
}: EnhancedManagerDashboardProps) {
  const { 
    parts, 
    technicians, 
    notifications, 
    updatePart, 
    bulkAssignParts, 
    bulkUpdateStatus,
    addNotification,
    markNotificationRead,
    clearAllNotifications
  } = useStore();

  const [activeTab, setActiveTab] = useState<'kanban' | 'analytics' | 'personnel' | 'assignments'>('kanban');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Filter states for assignments
  const [assignmentFilters, setAssignmentFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    aircraft: 'all',
    technician: 'all'
  });

  // Filtered parts for assignment
  const filteredParts = useMemo(() => {
    return parts.filter(part => {
      const matchesSearch = assignmentFilters.search === '' || 
        part.partNumber.toLowerCase().includes(assignmentFilters.search.toLowerCase()) ||
        part.aircraft.toLowerCase().includes(assignmentFilters.search.toLowerCase()) ||
        part.customer.toLowerCase().includes(assignmentFilters.search.toLowerCase());
      
      const matchesStatus = assignmentFilters.status === 'all' || part.status === assignmentFilters.status;
      const matchesPriority = assignmentFilters.priority === 'all' || part.priority === assignmentFilters.priority;
      const matchesAircraft = assignmentFilters.aircraft === 'all' || part.aircraft === assignmentFilters.aircraft;
      const matchesTechnician = assignmentFilters.technician === 'all' || part.assignedTechnician === assignmentFilters.technician;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesAircraft && matchesTechnician;
    });
  }, [parts, assignmentFilters]);

  // Get unique values for filters
  const uniqueAircraft = useMemo(() => [...new Set(parts.map(p => p.aircraft))], [parts]);
  const uniqueCustomers = useMemo(() => [...new Set(parts.map(p => p.customer))], [parts]);

  // Calculate statistics
  const statistics = useMemo(() => ({
    unrepaired: parts.filter(p => p.status === 'unrepaired').length,
    inRepair: parts.filter(p => p.status === 'in-repair').length,
    repaired: parts.filter(p => p.status === 'repaired').length,
    scrap: parts.filter(p => p.status === 'scrap').length,
    shipped: parts.filter(p => p.status === 'shipped').length,
    overdue: parts.filter(p => p.isOverdue).length,
    unassigned: parts.filter(p => p.status === 'unrepaired' && !p.assignedTechnician).length
  }), [parts]);

  // Unread notifications count
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const handleBulkAssign = (technicianId: string) => {
    if (selectedParts.length > 0) {
      bulkAssignParts(selectedParts, technicianId);
      setSelectedParts([]);
      addNotification({
        type: 'success',
        title: 'Bulk Assignment Complete',
        message: `Assigned ${selectedParts.length} parts to ${technicians.find(t => t.id === technicianId)?.name}`,
        timestamp: new Date().toISOString(),
        read: false
      });
    }
  };

  const handleBulkStatusUpdate = (status: Part['status']) => {
    if (selectedParts.length > 0) {
      bulkUpdateStatus(selectedParts, status);
      setSelectedParts([]);
      addNotification({
        type: 'success',
        title: 'Bulk Status Update Complete',
        message: `Updated ${selectedParts.length} parts to ${status.replace('-', ' ')} status`,
        timestamp: new Date().toISOString(),
        read: false
      });
    }
  };

  const togglePartSelection = (partId: string) => {
    setSelectedParts(prev => 
      prev.includes(partId) 
        ? prev.filter(id => id !== partId)
        : [...prev, partId]
    );
  };

  const selectAllParts = () => {
    setSelectedParts(filteredParts.map(p => p.id));
  };

  const clearSelection = () => {
    setSelectedParts([]);
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      unrepaired: 'status-badge status-unrepaired',
      'in-repair': 'status-badge status-in-repair',
      repaired: 'status-badge status-repaired',
      scrap: 'status-badge status-scrap',
      shipped: 'status-badge status-shipped',
    };
    return statusClasses[status as keyof typeof statusClasses] || 'status-badge status-unrepaired';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unrepaired': return <Package className="w-4 h-4" />;
      case 'in-repair': return <Wrench className="w-4 h-4" />;
      case 'repaired': return <CheckCircle className="w-4 h-4" />;
      case 'scrap': return <XCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const priorityClasses = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800',
    };
    return `status-badge ${priorityClasses[priority as keyof typeof priorityClasses] || priorityClasses.low}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img
                src={manager.photo}
                alt={manager.name}
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Enhanced Manager Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {manager.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="flex gap-4 relative">
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="btn-primary flex items-center"
                >
                  Register Incoming Part
                </button>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-gray-900"
                >
                  <Bell className="w-6 h-6" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        <button
                          onClick={clearAllNotifications}
                          className="text-sm text-gray-500 hover:text-gray-700"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">No notifications</div>
                      ) : (
                        notifications.map(notification => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => markNotificationRead(notification.id)}
                          >
                            <div className="flex items-start">
                              <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                                notification.type === 'error' ? 'bg-red-500' :
                                notification.type === 'warning' ? 'bg-yellow-500' :
                                notification.type === 'success' ? 'bg-green-500' :
                                'bg-blue-500'
                              }`}></div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{notification.title}</h4>
                                <p className="text-sm text-gray-600">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(notification.timestamp).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={onLogout}
                className="btn-secondary flex items-center"
              >
                <Home className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('kanban')}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === 'kanban'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Kanban className="w-4 h-4 mr-2" />
                Kanban Board
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === 'analytics'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Shop Analytics
              </button>
              <button
                onClick={() => setActiveTab('personnel')}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === 'personnel'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="w-4 h-4 mr-2" />
                Personnel Performance
              </button>
              <button
                onClick={() => setActiveTab('assignments')}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === 'assignments'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Settings className="w-4 h-4 mr-2" />
                Assignments & Controls
              </button>
            </nav>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                <Package className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Unrepaired</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.unrepaired}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mr-4">
                <Wrench className="w-6 h-6 text-warning-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">In Repair</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.inRepair}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mr-4">
                <CheckCircle className="w-6 h-6 text-success-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Repaired</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.repaired}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-danger-100 rounded-lg flex items-center justify-center mr-4">
                <AlertTriangle className="w-6 h-6 text-danger-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.overdue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'kanban' && (
          <KanbanBoard
            manager={manager}
            parts={parts}
            onUpdatePart={updatePart}
            onLogout={onLogout}
          />
        )}

        {activeTab === 'analytics' && <ShopAnalytics />}

        {activeTab === 'personnel' && <PersonnelPerformance />}

        {activeTab === 'assignments' && (
          <div className="space-y-6">
            {/* Assignment Filters */}
            <div className="card">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Filter className="w-5 h-5 mr-2 text-primary-600" />
                  Assignment Filters
                </h3>
                <button
                  onClick={() => setAssignmentFilters({
                    search: '',
                    status: 'all',
                    priority: 'all',
                    aircraft: 'all',
                    technician: 'all'
                  })}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear All
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Part number, aircraft, customer..."
                      value={assignmentFilters.search}
                      onChange={(e) => setAssignmentFilters(prev => ({ ...prev, search: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={assignmentFilters.status}
                    onChange={(e) => setAssignmentFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="unrepaired">Unrepaired</option>
                    <option value="in-repair">In Repair</option>
                    <option value="repaired">Repaired</option>
                    <option value="scrap">Scrap</option>
                    <option value="shipped">Shipped</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={assignmentFilters.priority}
                    onChange={(e) => setAssignmentFilters(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aircraft</label>
                  <select
                    value={assignmentFilters.aircraft}
                    onChange={(e) => setAssignmentFilters(prev => ({ ...prev, aircraft: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">All Aircraft</option>
                    {uniqueAircraft.map(aircraft => (
                      <option key={aircraft} value={aircraft}>{aircraft}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Technician</label>
                  <select
                    value={assignmentFilters.technician}
                    onChange={(e) => setAssignmentFilters(prev => ({ ...prev, technician: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">All Technicians</option>
                    <option value="">Unassigned</option>
                    {technicians.map(tech => (
                      <option key={tech.id} value={tech.id}>{tech.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedParts.length > 0 && (
              <div className="card bg-blue-50 border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-blue-900">
                    Bulk Actions ({selectedParts.length} parts selected)
                  </h3>
                  <button
                    onClick={clearSelection}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear Selection
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">Assign to Technician</label>
                    <div className="flex gap-2">
                      <select
                        onChange={(e) => e.target.value && handleBulkAssign(e.target.value)}
                        className="flex-1 p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Technician...</option>
                        {technicians.map(tech => (
                          <option key={tech.id} value={tech.id}>{tech.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-2">Update Status</label>
                    <div className="flex gap-2">
                      <select
                        onChange={(e) => e.target.value && handleBulkStatusUpdate(e.target.value as Part['status'])}
                        className="flex-1 p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Status...</option>
                        <option value="in-repair">In Repair</option>
                        <option value="repaired">Repaired</option>
                        <option value="scrap">Scrap</option>
                        <option value="shipped">Shipped</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Parts Table */}
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Parts ({filteredParts.length} of {parts.length})
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={selectAllParts}
                    className="btn-secondary text-sm flex items-center"
                  >
                    <CheckSquare className="w-4 h-4 mr-1" />
                    Select All
                  </button>
                  <button
                    onClick={clearSelection}
                    className="btn-secondary text-sm"
                  >
                    Clear
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          checked={selectedParts.length === filteredParts.length && filteredParts.length > 0}
                          onChange={selectedParts.length === filteredParts.length ? clearSelection : selectAllParts}
                          className="rounded border-gray-300"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Part Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aircraft
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assigned Technician
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Entered Shop
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Repair Start
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Repair End
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredParts.map((part) => (
                      <tr key={part.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedParts.includes(part.id)}
                            onChange={() => togglePartSelection(part.id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {part.partNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {part.aircraft}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`${getStatusBadge(part.status)} flex items-center w-fit`}>
                            {getStatusIcon(part.status)}
                            <span className="ml-1 capitalize">{part.status.replace('-', ' ')}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`${getPriorityBadge(part.priority)} flex items-center w-fit`}>
                            <span className="capitalize">{part.priority}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {part.assignedTechnician ? 
                            technicians.find(t => t.id === part.assignedTechnician)?.name : 
                            'Unassigned'
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {part.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(part.enteredShop)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {part.repairStarted ? formatDate(part.repairStarted) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {part.repairCompleted ? formatDate(part.repairCompleted) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => setSelectedPart(part)}
                            className="btn-primary text-sm flex items-center"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Timeline
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Part Timeline Modal */}
      {selectedPart && (
        <PartTimeline
          part={selectedPart}
          onClose={() => setSelectedPart(null)}
        />
      )}

      {/* Part Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-blue-200 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold"
              onClick={() => setShowRegisterModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <IncomingPartRegistration onHome={() => setShowRegisterModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

