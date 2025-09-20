'use client';

import { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { Technician, Part } from '@/types';
import PartTimeline from './PartTimeline';
import { 
  Home, 
  Package, 
  Wrench, 
  CheckCircle, 
  XCircle, 
  Truck,
  Clock,
  Star,
  Award,
  Target,
  MessageSquare,
  Plus,
  Send,
  TrendingUp,
  Zap,
  Calendar,
  Timer
} from 'lucide-react';

interface EnhancedTechnicianWorkspaceProps {
  technician: Technician;
  onLogout: () => void;
  onRegisterPart: () => void;
}

export default function EnhancedTechnicianWorkspace({ 
  technician, 
  onLogout, 
  onRegisterPart
}: EnhancedTechnicianWorkspaceProps) {
  const { parts, updatePart, addPartNote, updateTechnicianStats, addTechnicianBadge } = useStore();
  const [view, setView] = useState<'my-parts' | 'repairable-parts'>('my-parts');
  // Parts available to pick (unassigned, unrepaired)
  const availableParts = parts.filter(
    part => part.status === 'unrepaired' && !part.assignedTechnician
  );

  // Handler to pick a part and start repair
  const handlePickPart = (partId: string) => {
    updatePart(partId, {
      assignedTechnician: technician.id,
      status: 'in-repair',
      repairStarted: new Date().toISOString(),
      updatedBy: technician.name
    });
  };
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [newNote, setNewNote] = useState('');
  const [showAddNote, setShowAddNote] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [scannedPart, setScannedPart] = useState<Part | null>(null);

  // Filter parts assigned to this technician
  const assignedParts = useMemo(() => {
    return parts.filter(part => part.assignedTechnician === technician.id);
  }, [parts, technician.id]);

  // Calculate today's progress
  const todayProgress = useMemo(() => {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const completedToday = assignedParts.filter(part => {
      if (!part.repairCompleted) return false;
      const completedDate = new Date(part.repairCompleted);
      return completedDate >= todayStart;
    }).length;

    const hoursWorkedToday = assignedParts
      .filter(part => part.repairStarted && part.repairCompleted)
      .filter(part => {
        const completedDate = new Date(part.repairCompleted!);
        return completedDate >= todayStart;
      })
      .reduce((sum, part) => sum + (part.actualHours || 0), 0);

    const remainingHours = Math.max(0, 8 - hoursWorkedToday);
    const progressPercentage = (hoursWorkedToday / 8) * 100;

    return {
      completedToday,
      hoursWorkedToday,
      remainingHours,
      progressPercentage
    };
  }, [assignedParts]);

  // Check for badge achievements
  const checkBadges = () => {
    const stats = technician.stats;
    
    // Speed Demon badge
    if (stats.repairedCount.week >= 10 && !technician.badges.includes('Speed Demon')) {
      addTechnicianBadge(technician.id, 'Speed Demon');
    }
    
    // Quality Master badge
    if (stats.scrapRate < 5 && stats.repairedCount.month >= 20 && !technician.badges.includes('Quality Master')) {
      addTechnicianBadge(technician.id, 'Quality Master');
    }
    
    // Efficiency Expert badge
    if (stats.efficiency >= 90 && !technician.badges.includes('Efficiency Expert')) {
      addTechnicianBadge(technician.id, 'Efficiency Expert');
    }
    
    // Team Player badge
    if (stats.repairedCount.month >= 30 && !technician.badges.includes('Team Player')) {
      addTechnicianBadge(technician.id, 'Team Player');
    }
  };

  const handleStatusUpdate = (partId: string, status: Part['status'], actualHours?: number) => {
    const part = parts.find(p => p.id === partId);
    if (!part) return;

    const updates: Partial<Part> = { status };
    
    // Set specific timestamps based on status
    if (status === 'in-repair' && part.status === 'unrepaired') {
      updates.repairStarted = new Date().toISOString();
    } else if (status === 'repaired' && part.status === 'in-repair') {
      updates.repairCompleted = new Date().toISOString();
      if (actualHours) {
        updates.actualHours = actualHours;
      }
    } else if (status === 'shipped' && part.status === 'repaired') {
      updates.shippedDate = new Date().toISOString();
    } else if (status === 'scrap') {
      updates.scrappedDate = new Date().toISOString();
    }

    updatePart(partId, updates);
    
    // Update technician stats
    if (status === 'repaired') {
      updateTechnicianStats(technician.id, {
        repairedCount: {
          ...technician.stats.repairedCount,
          today: technician.stats.repairedCount.today + 1,
          week: technician.stats.repairedCount.week + 1,
          month: technician.stats.repairedCount.month + 1
        }
      });
      
      // Check for new badges
      checkBadges();
    }
  };

  const handleAddNote = (partId: string) => {
    if (newNote.trim()) {
      addPartNote(partId, newNote, technician.id);
      setNewNote('');
      setShowAddNote(false);
    }
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

  // Simulate scanning: pick first assigned part for demo
  // Gather all unrepaired and in-repair parts technician can scan
  const scanOptions = [
    ...assignedParts.filter(p => p.status === 'unrepaired' || p.status === 'in-repair'),
    ...availableParts.filter(p => p.status === 'unrepaired' || p.status === 'in-repair')
  ];

  const [selectedScanId, setSelectedScanId] = useState<string>('');

  const handleFakeScan = () => {
    const partToScan = scanOptions.find(p => p.id === selectedScanId);
    if (partToScan) {
      setScannedPart(partToScan);
      setShowScanModal(false);
    } else {
      setScannedPart(null);
      // Keep scan modal open and show a message if no part is found
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img
                src={technician.photo}
                alt={technician.name}
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Technician Workspace</h1>
                <p className="text-sm text-gray-600">Welcome back, {technician.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={onRegisterPart}
                className="btn-primary flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" /> Register Incoming Part
              </button>
              <button
                onClick={() => setShowScanModal(true)}
                className="btn-secondary flex items-center"
              >
                <Package className="w-4 h-4 mr-2" /> Scan Part
              </button>
              <button
                onClick={onLogout}
                className="btn-secondary flex items-center"
              >
                <Home className="w-4 h-4 mr-2" /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-gray-900">{todayProgress.completedToday}</p>
              </div>
            </div>
          </div>
          <div className="card bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Hours Worked</p>
                <p className="text-2xl font-bold text-gray-900">{todayProgress.hoursWorkedToday.toFixed(1)}h</p>
              </div>
            </div>
          </div>
          <div className="card bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <Timer className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Remaining Hours</p>
                <p className="text-2xl font-bold text-gray-900">{todayProgress.remainingHours.toFixed(1)}h</p>
              </div>
            </div>
          </div>
          <div className="card bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                <Target className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Daily Progress</p>
                <p className="text-2xl font-bold text-gray-900">{todayProgress.progressPercentage.toFixed(0)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">My Performance</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Efficiency:</span>
                <span className="font-medium">{technician.stats.efficiency}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Repair Time:</span>
                <span className="font-medium">{technician.stats.avgRepairTime}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">On-time Delivery:</span>
                <span className="font-medium">{technician.stats.onTimeDelivery}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Scrap Rate:</span>
                <span className="font-medium">{technician.stats.scrapRate}%</span>
              </div>
            </div>
          </div>
          <div className="card bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">My Skills</h3>
            <div className="flex flex-wrap gap-2">
              {technician.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="card bg-white shadow-lg rounded-xl p-5 hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">My Badges</h3>
            <div className="flex flex-wrap gap-2">
              {technician.badges.map((badge, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                >
                  <Star className="w-3 h-3 mr-1" />
                  {badge}
                </span>
              ))}
              {technician.badges.length === 0 && (
                <p className="text-gray-500 text-sm">No badges yet. Keep working to earn them!</p>
              )}
            </div>
          </div>
        </div>
<div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setView('my-parts')}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${view === 'my-parts' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <Package className="w-4 h-4 mr-2" />
                My Parts
              </button>
              <button
                onClick={() => setView('repairable-parts')}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${view === 'repairable-parts' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                <Wrench className="w-4 h-4 mr-2" />
                Repairable Pool
              </button>
            </nav>
          </div>
        </div>
        {/* Main Content */}
        <div>
          {view === 'my-parts' ? (
            <div className="card bg-white shadow-lg rounded-xl p-5">
              {assignedParts.length === 0 ? (
                <div className="text-center py-12 opacity-80">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No parts assigned</h3>
                  <p className="text-gray-600">You don't have any parts assigned to you yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignedParts.map((part) => (
                    <div key={part.id} className="bg-gradient-to-r from-blue-50 via-white to-gray-100 rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-blue-900 text-lg">{part.partNumber}</h3>
                            <span className={`${getStatusBadge(part.status)} flex items-center w-fit`}>
                              {getStatusIcon(part.status)}
                              <span className="ml-1 capitalize">{part.status.replace('-', ' ')}</span>
                            </span>
                            <span className={`${getPriorityBadge(part.priority)} flex items-center w-fit`}>
                              <span className="capitalize">{part.priority}</span>
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p><span className="font-semibold text-gray-700">Aircraft:</span> {part.aircraft}</p>
                            <p><span className="font-semibold text-gray-700">Customer:</span> {part.customer}</p>
                            <p><span className="font-semibold text-gray-700">Description:</span> {part.description}</p>
                            <p><span className="font-semibold text-gray-700">Estimated Hours:</span> {part.estimatedHours}h</p>
                            <p><span className="font-semibold text-gray-700">Entered Shop:</span> {formatDate(part.enteredShop)}</p>
                            {part.repairStarted && (
                              <p><span className="font-semibold text-gray-700">Repair Started:</span> {formatDate(part.repairStarted)}</p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedPart(part)}
                          className="btn-primary text-sm flex items-center px-3 py-1 rounded-lg shadow hover:bg-blue-700 transition-colors"
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          View Timeline
                        </button>
                      </div>
                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        {part.status === 'in-repair' && !part.repairStarted && (
                          <button
                            onClick={() => {
                              updatePart(part.id, {
                                repairStarted: new Date().toISOString(),
                                updatedBy: technician.name
                              });
                            }}
                            className="btn-warning text-sm flex items-center px-3 py-1 rounded-lg shadow hover:bg-yellow-600 transition-colors"
                          >
                            <Wrench className="w-4 h-4 mr-1" />
                            Start Repair
                          </button>
                        )}
                        {part.status === 'unrepaired' && (
                          <button
                            onClick={() => {
                              updatePart(part.id, {
                                assignedTechnician: technician.id,
                                status: 'in-repair',
                                updatedBy: technician.name
                              });
                            }}
                            className="btn-warning text-sm flex items-center px-3 py-1 rounded-lg shadow hover:bg-yellow-600 transition-colors"
                          >
                            <Wrench className="w-4 h-4 mr-1" />
                            Start Repair
                          </button>
                        )}
                        {part.status === 'in-repair' && (
                          <>
                            <button
                              onClick={() => {
                                const actualHours = prompt('Enter actual hours worked:');
                                if (actualHours && !isNaN(parseFloat(actualHours))) {
                                  handleStatusUpdate(part.id, 'repaired', parseFloat(actualHours));
                                }
                              }}
                              className="btn-success text-sm flex items-center px-3 py-1 rounded-lg shadow hover:bg-green-700 transition-colors"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Mark Completed
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(part.id, 'scrap')}
                              className="btn-danger text-sm flex items-center px-3 py-1 rounded-lg shadow hover:bg-red-700 transition-colors"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Scrap
                            </button>
                          </>
                        )}
                        {part.status === 'repaired' && (
                          <button
                            onClick={() => handleStatusUpdate(part.id, 'shipped')}
                            className="btn-primary text-sm flex items-center px-3 py-1 rounded-lg shadow hover:bg-blue-700 transition-colors"
                          >
                            <Truck className="w-4 h-4 mr-1" />
                            Ship
                          </button>
                        )}
                        {/* Add Note Button */}
                        <button
                          onClick={() => {
                            setSelectedPart(part);
                            setShowAddNote(true);
                          }}
                          className="btn-secondary text-sm flex items-center px-3 py-1 rounded-lg shadow hover:bg-gray-200 transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Note
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="card bg-white shadow-lg rounded-xl p-5">
              {availableParts.length === 0 ? (
                <div className="text-gray-500">No unassigned, unrepaired parts available.</div>
              ) : (
                <div className="space-y-4">
                  {availableParts.map(part => (
                    <div key={part.id} className="bg-gradient-to-r from-blue-100 via-white to-blue-50 rounded-lg p-4 flex justify-between items-center border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                      <div>
                        <div className="font-bold">{part.partNumber}</div>
                        <div className="text-sm">{part.description}</div>
                      </div>
                      <button
                        className="btn-primary px-3 py-1 rounded-lg shadow hover:bg-blue-700 transition-colors"
                        onClick={() => handlePickPart(part.id)}
                      >
                        Start Repair
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Part Timeline Modal */}
          {selectedPart && (
            <PartTimeline
              part={selectedPart}
              onClose={() => {
                setSelectedPart(null);
                setShowAddNote(false);
              }}
            />
          )}

          {/* Add Note Modal */}
          {showAddNote && selectedPart && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Note for {selectedPart.partNumber}</h3>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Enter your note..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 mb-4"
                  rows={4}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddNote(selectedPart.id)}
                    className="btn-primary flex items-center"
                  >
                    <Send className="w-4 h-4 mr-1" />
                    Send Note
                  </button>
                  <button
                    onClick={() => {
                      setShowAddNote(false);
                      setNewNote('');
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Scan Part Modal */}
          {showScanModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Scan Part QR Code</h3>
                <p className="mb-4 text-gray-600">Select a part to scan from the list below.</p>
                {scanOptions.length > 0 ? (
                  <>
                    <select
                      value={selectedScanId}
                      onChange={e => setSelectedScanId(e.target.value)}
                      className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Select part...</option>
                      {scanOptions.map(part => (
                        <option key={part.id} value={part.id}>
                          {part.partNumber} - {part.description}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleFakeScan}
                      className="btn-primary px-6 py-2 text-lg w-full"
                      disabled={!selectedScanId}
                    >
                      Scan Selected Part
                    </button>
                  </>
                ) : (
                  <div className="text-gray-500 mb-4">No unrepaired parts available to scan.</div>
                )}
                <button
                  onClick={() => setShowScanModal(false)}
                  className="btn-secondary mt-4 w-full"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Scanned Part Detail Modal */}
          {scannedPart && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-blue-200 relative">
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold"
                  onClick={() => setScannedPart(null)}
                  aria-label="Close"
                >
                  &times;
                </button>
                <h2 className="text-2xl font-bold mb-4">Part Detail</h2>
                <div className="mb-4">
                  <div className="font-semibold text-gray-900">{scannedPart.partNumber}</div>
                  <div className="text-gray-600">{scannedPart.description}</div>
                  <div className="text-gray-600">Status: <span className="capitalize">{scannedPart.status}</span></div>
                  <div className="text-gray-600">Estimated Hours: {scannedPart.estimatedHours}h</div>
                </div>
                {/* Assignment and action logic */}
                <div className="flex flex-col gap-2">
                  {(scannedPart.status === 'unrepaired' || !scannedPart.repairStarted) && (
                    <>
                      {(!scannedPart.assignedTechnician || scannedPart.assignedTechnician === technician.id) ? (
                        <button
                          className="btn-warning flex items-center"
                          onClick={() => {
                            // Assign to technician and set repairStarted
                            updatePart(scannedPart.id, {
                              assignedTechnician: technician.id,
                              status: 'in-repair',
                              repairStarted: new Date().toISOString(),
                              updatedBy: technician.name
                            });
                            setScannedPart({ ...scannedPart, status: 'in-repair', assignedTechnician: technician.id, repairStarted: new Date().toISOString() });
                          }}
                        >
                          <Wrench className="w-4 h-4 mr-1" /> Start Repair
                        </button>
                      ) : (
                        <div className="text-red-600 font-semibold">This part is assigned to another technician.</div>
                      )}
                    </>
                  )}
                  
                  {scannedPart.status === 'in-repair' && scannedPart.assignedTechnician === technician.id && (
                    <button
                      className="btn-success flex items-center"
                      onClick={() => {
                        // Prompt for actual hours
                        const actualHours = prompt('Enter actual hours worked:');
                        if (actualHours && !isNaN(parseFloat(actualHours))) {
                          handleStatusUpdate(scannedPart.id, 'repaired', parseFloat(actualHours));
                          setScannedPart(null);
                        }
                      }}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" /> Mark Completed
                    </button>
                  )}
                  {scannedPart.status === 'repaired' && scannedPart.assignedTechnician === technician.id && (
                    <button
                      className="btn-primary flex items-center"
                      onClick={() => {
                        handleStatusUpdate(scannedPart.id, 'shipped');
                        setScannedPart(null);
                      }}
                    >
                      <Truck className="w-4 h-4 mr-1" /> Ship
                    </button>
                  )}
                  {/* Scrap button only for assigned technician */}
                  {scannedPart.assignedTechnician === technician.id && (
                    <button
                      className="btn-danger flex items-center"
                      onClick={() => {
                        handleStatusUpdate(scannedPart.id, 'scrap');
                        setScannedPart(null);
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-1" /> Scrap
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

