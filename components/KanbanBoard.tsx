'use client';

import { useState, useMemo } from 'react';
import { Manager, Part, Technician } from '@/types';
import { technicians } from '@/data/enhancedMockData';
import { 
  Home, 
  Package, 
  Wrench, 
  CheckCircle, 
  XCircle, 
  Truck,
  Users,
  Clock,
  Zap,
  AlertCircle,
  Plus,
  Minus
} from 'lucide-react';

interface KanbanBoardProps {
  manager: Manager;
  parts: Part[];
  onUpdatePart: (partId: string, updates: Partial<Part>) => void;
  onLogout: () => void;
}

interface DragItem {
  partId: string;
  sourceColumn: string;
  sourceIndex: number;
}

export default function KanbanBoard({ 
  manager, 
  parts, 
  onUpdatePart, 
  onLogout 
}: KanbanBoardProps) {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [showEmployeeBoxes, setShowEmployeeBoxes] = useState(false);

  // Group parts by status
  const partsByStatus = useMemo(() => {
    return {
      unrepaired: parts.filter(p => p.status === 'unrepaired'),
      'in-repair': parts.filter(p => p.status === 'in-repair'),
      repaired: parts.filter(p => p.status === 'repaired'),
      scrap: parts.filter(p => p.status === 'scrap'),
      shipped: parts.filter(p => p.status === 'shipped'),
    };
  }, [parts]);

  // Calculate employee workload
  const employeeWorkload = useMemo(() => {
    return technicians.map((tech: Technician) => {
      const assignedParts = parts.filter(p => p.assignedTechnician === tech.id && p.status === 'in-repair');
      const totalHours = assignedParts.reduce((sum, part) => sum + (part.estimatedHours || 0), 0);
      const dailyCapacity = 8; // 8 hours per day
      const utilization = Math.min((totalHours / dailyCapacity) * 100, 100);
      
      return {
        ...tech,
        assignedParts,
        totalHours,
        dailyCapacity,
        utilization,
        availableHours: Math.max(0, dailyCapacity - totalHours)
      };
    });
  }, [parts]);

  // Auto-assignment algorithm
  const autoAssignParts = () => {
    const unassignedParts = parts.filter(p => p.status === 'unrepaired' && !p.assignedTechnician);

    // Sort parts by priority (critical first, then by estimated hours)
    const sortedParts = [...unassignedParts].sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
      if (aPriority !== bPriority) return bPriority - aPriority;
      return (b.estimatedHours || 0) - (a.estimatedHours || 0);
    });

    // Track available hours for each technician
    const availableHoursMap: Record<string, number> = {};
    employeeWorkload.forEach(emp => {
      availableHoursMap[emp.id] = emp.availableHours;
    });

    sortedParts.forEach(part => {
      // Find employee with enough capacity
      const suitableEmployee = employeeWorkload.find(emp =>
        availableHoursMap[emp.id] >= (part.estimatedHours || 0)
      );
      if (suitableEmployee) {
        onUpdatePart(part.id, {
          assignedTechnician: suitableEmployee.id,
          status: 'in-repair',
          //repairStarted: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          updatedBy: suitableEmployee.name
        });
        // Update local available hours for this technician
        availableHoursMap[suitableEmployee.id] -= (part.estimatedHours || 0);
      }
    });
  };

  const handleDragStart = (e: React.DragEvent, partId: string, sourceColumn: string, sourceIndex: number) => {
    setDraggedItem({ partId, sourceColumn, sourceIndex });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetColumn: string) => {
    e.preventDefault();
    
    if (!draggedItem) return;

    const part = parts.find(p => p.id === draggedItem.partId);
    if (!part) return;

    // Map column names to status
    const statusMap: { [key: string]: string } = {
      'unrepaired': 'unrepaired',
      'in-repair': 'in-repair',
      'repaired': 'repaired',
      'scrap': 'scrap',
      'shipped': 'shipped'
    };

    const newStatus = statusMap[targetColumn];
    if (!newStatus) return;

    // Update part status
    const updates: Partial<Part> = {
      status: newStatus as any,
      lastUpdated: new Date().toISOString(),
      updatedBy: manager.name
    };

    // Set specific timestamps based on status change
    if (newStatus === 'in-repair' && part.status === 'unrepaired') {
      //updates.repairStarted = new Date().toISOString();
    } else if (newStatus === 'repaired' && part.status === 'in-repair') {
      updates.repairCompleted = new Date().toISOString();
    } else if (newStatus === 'shipped' && part.status === 'repaired') {
      updates.shippedDate = new Date().toISOString();
    } else if (newStatus === 'scrap') {
      updates.scrappedDate = new Date().toISOString();
    }

    onUpdatePart(part.id, updates);
    setDraggedItem(null);
  };

  const handleDropOnEmployee = (e: React.DragEvent, technicianId: string) => {
    e.preventDefault();
    
    if (!draggedItem) return;

    const part = parts.find(p => p.id === draggedItem.partId);
    if (!part) return;

      const technician = technicians.find((t: Technician) => t.id === technicianId);
    if (!technician) return;

    onUpdatePart(part.id, {
      assignedTechnician: technicianId,
      status: 'in-repair',
      //repairStarted: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      updatedBy: manager.name
    });

    setDraggedItem(null);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unrepaired': return 'bg-gray-100 border-gray-300';
      case 'in-repair': return 'bg-warning-100 border-warning-300';
      case 'repaired': return 'bg-success-100 border-success-300';
      case 'scrap': return 'bg-danger-100 border-danger-300';
      case 'shipped': return 'bg-primary-100 border-primary-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 100) return 'bg-red-500';
    if (utilization >= 80) return 'bg-orange-500';
    if (utilization >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const columns = [
    { id: 'unrepaired', title: 'To Be Repaired', icon: Package },
    { id: 'in-repair', title: 'Repairing', icon: Wrench },
    { id: 'repaired', title: 'Repaired', icon: CheckCircle },
    { id: 'scrap', title: 'Scrap', icon: XCircle },
    { id: 'shipped', title: 'Shipped', icon: Truck },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Kanban Management</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowEmployeeBoxes(!showEmployeeBoxes)}
                className={`btn-secondary flex items-center ${showEmployeeBoxes ? 'bg-primary-100 text-primary-700' : ''}`}
              >
                <Users className="w-4 h-4 mr-2" />
                {showEmployeeBoxes ? 'Hide' : 'Show'} Employees
              </button>
              <button
                onClick={autoAssignParts}
                className="btn-primary flex items-center"
              >
                <Zap className="w-4 h-4 mr-2" />
                Auto Assign
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Employee Workload Boxes */}
        {showEmployeeBoxes && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-primary-600" />
              Employee Workload (8h/day capacity)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {employeeWorkload.map((employee: any) => (
                <div
                  key={employee.id}
                  className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-4 min-h-[200px]"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropOnEmployee(e, employee.id)}
                >
                  <div className="flex items-center mb-3">
                    <img
                      src={employee.photo}
                      alt={employee.name}
                      className="w-8 h-8 rounded-full object-cover mr-2"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm text-gray-900">{employee.name}</h3>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {employee.totalHours.toFixed(1)}h / {employee.dailyCapacity}h
                      </div>
                    </div>
                  </div>

                  {/* Utilization Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Utilization</span>
                      <span>{employee.utilization.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getUtilizationColor(employee.utilization)}`}
                        style={{ width: `${Math.min(employee.utilization, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Available Hours */}
                  <div className="mb-3">
                    <div className="text-xs text-gray-600 mb-1">Available Hours</div>
                    <div className={`text-lg font-bold ${
                      employee.availableHours > 4 ? 'text-green-600' :
                      employee.availableHours > 2 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {employee.availableHours.toFixed(1)}h
                    </div>
                  </div>

                  {/* Assigned Parts */}
                  <div className="space-y-1">
                    {employee.assignedParts.map((part: Part) => (
                      <div
                        key={part.id}
                        className="bg-gray-50 rounded p-2 text-xs"
                        draggable
                        onDragStart={(e) => handleDragStart(e, part.id, 'in-repair', 0)}
                      >
                        <div className="font-medium text-gray-900">{part.partNumber}</div>
                        <div className="text-gray-500">{part.aircraft}</div>
                        <div className="flex items-center justify-between mt-1">
                          <span className={`px-1 py-0.5 rounded text-xs ${getPriorityColor(part.priority)}`}>
                            {part.priority}
                          </span>
                          <span className="text-gray-500">{part.estimatedHours}h</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Capacity Warning */}
                  {employee.utilization >= 100 && (
                    <div className="mt-2 flex items-center text-xs text-red-600">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Overloaded
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {columns.map((column) => (
            <div
              key={column.id}
              className={`bg-white rounded-lg border-2 border-dashed ${getStatusColor(column.id)} min-h-[600px]`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <column.icon className="w-5 h-5 mr-2" />
                    <h3 className="font-semibold text-gray-900">{column.title}</h3>
                  </div>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                    {partsByStatus[column.id as keyof typeof partsByStatus]?.length || 0}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {partsByStatus[column.id as keyof typeof partsByStatus]?.map((part: Part, index: number) => (
                  <div
                    key={part.id}
                    className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow cursor-move"
                    draggable
                    onDragStart={(e) => handleDragStart(e, part.id, column.id, index)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-medium text-sm text-gray-900">{part.partNumber}</div>
                      <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(part.priority)}`}>
                        {part.priority}
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-600 mb-2">
                      <div>{part.aircraft}</div>
                      <div>{part.customer}</div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {part.estimatedHours}h
                      </div>
                      {part.assignedTechnician && (
                        <div className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {technicians.find((t: Technician) => t.id === part.assignedTechnician)?.name}
                        </div>
                      )}
                    </div>

                    {part.description && (
                      <div className="text-xs text-gray-500 mt-2 truncate">
                        {part.description}
                      </div>
                    )}
                  </div>
                ))}

                {(!partsByStatus[column.id as keyof typeof partsByStatus] || partsByStatus[column.id as keyof typeof partsByStatus].length === 0) && (
                  <div className="text-center text-gray-400 text-sm py-8">
                    Drop parts here
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-4">
          {columns.map((column) => {
            const columnParts = partsByStatus[column.id as keyof typeof partsByStatus] || [];
            const totalHours = columnParts.reduce((sum, part) => sum + (part.estimatedHours || 0), 0);
            
            return (
              <div key={column.id} className="bg-white rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <column.icon className="w-4 h-4 mr-2 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">{column.title}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{columnParts.length}</div>
                <div className="text-xs text-gray-500">{totalHours.toFixed(1)}h total</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
