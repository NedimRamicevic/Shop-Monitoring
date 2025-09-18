'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Part, PartHistoryEntry } from '@/types';
import { 
  Clock, 
  User, 
  MessageSquare, 
  ArrowRight, 
  Package, 
  Wrench, 
  CheckCircle, 
  XCircle, 
  Truck,
  X,
  Plus,
  Send
} from 'lucide-react';

interface PartTimelineProps {
  part: Part;
  onClose: () => void;
}

export default function PartTimeline({ part, onClose }: PartTimelineProps) {
  const { addPartNote, technicians } = useStore();
  const [newNote, setNewNote] = useState('');
  const [showAddNote, setShowAddNote] = useState(false);

  const handleAddNote = () => {
    if (newNote.trim() && part.assignedTechnician) {
      addPartNote(part.id, newNote, part.assignedTechnician);
      setNewNote('');
      setShowAddNote(false);
    }
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
      case 'unrepaired': return 'text-gray-600 bg-gray-100';
      case 'in-repair': return 'text-yellow-600 bg-yellow-100';
      case 'repaired': return 'text-green-600 bg-green-100';
      case 'scrap': return 'text-red-600 bg-red-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const hours = (end - start) / (1000 * 60 * 60);
    return `${hours.toFixed(1)}h`;
  };

  // Combine history and notes into a single timeline
  const timelineItems = [
    ...part.history.map(entry => ({ ...entry, type: 'history' as const })),
    ...part.notes.map((note, index) => ({
      id: `note_${index}`,
      timestamp: note.split(' - ')[0],
      action: 'Note added',
      notes: note.split(' - ').slice(2).join(' - '),
      technicianName: note.split(' - ')[1],
      type: 'note' as const
    }))
  ].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Part Timeline</h2>
              <div className="mt-2">
                <h3 className="text-lg font-semibold text-gray-800">{part.partNumber}</h3>
                <p className="text-gray-600">{part.aircraft} - {part.customer}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Part Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Current Status</h4>
              <div className="flex items-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(part.status)}`}>
                  {getStatusIcon(part.status)}
                  <span className="ml-1 capitalize">{part.status.replace('-', ' ')}</span>
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Priority</h4>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(part.priority)}`}>
                {part.priority}
              </span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Time in Status</h4>
              <p className="text-gray-600">{part.daysInStatus} days</p>
            </div>
          </div>

          {/* Add Note Section */}
          {part.assignedTechnician && (
            <div className="mb-6">
              {!showAddNote ? (
                <button
                  onClick={() => setShowAddNote(true)}
                  className="btn-primary flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Note
                </button>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Add Note</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Enter your note..."
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button
                      onClick={handleAddNote}
                      className="btn-primary flex items-center"
                    >
                      <Send className="w-4 h-4 mr-1" />
                      Send
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
              )}
            </div>
          )}

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Timeline</h3>
            
            {timelineItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No timeline entries yet
              </div>
            ) : (
              <div className="space-y-4">
                {timelineItems.map((item, index) => (
                  <div key={item.id} className="flex items-start space-x-4">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        item.type === 'history' ? 'bg-primary-100 text-primary-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {item.type === 'history' ? getStatusIcon(item.toStatus || 'unrepaired') : <MessageSquare className="w-4 h-4" />}
                      </div>
                      {index < timelineItems.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-200 mt-2"></div>
                      )}
                    </div>

                    {/* Timeline content */}
                    <div className="flex-1 min-w-0">
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{item.action}</h4>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatDateTime(item.timestamp)}
                          </div>
                        </div>

                        {item.type === 'history' && (
                          <div className="space-y-2">
                            {item.fromStatus && item.toStatus && (
                              <div className="flex items-center text-sm text-gray-600">
                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.fromStatus)}`}>
                                  {getStatusIcon(item.fromStatus)}
                                  <span className="ml-1 capitalize">{item.fromStatus.replace('-', ' ')}</span>
                                </span>
                                <ArrowRight className="w-4 h-4 mx-2 text-gray-400" />
                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.toStatus)}`}>
                                  {getStatusIcon(item.toStatus)}
                                  <span className="ml-1 capitalize">{item.toStatus.replace('-', ' ')}</span>
                                </span>
                              </div>
                            )}

                            {item.technicianName && (
                              <div className="flex items-center text-sm text-gray-600">
                                <User className="w-4 h-4 mr-1" />
                                {item.technicianName}
                              </div>
                            )}

                            {item.estimatedHours && item.actualHours && (
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Time:</span> {item.estimatedHours}h estimated, {item.actualHours}h actual
                                {item.actualHours < item.estimatedHours && (
                                  <span className="text-green-600 ml-2">(Saved {item.estimatedHours - item.actualHours}h)</span>
                                )}
                              </div>
                            )}

                            {item.notes && (
                              <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                                <span className="font-medium">Note:</span> {item.notes}
                              </div>
                            )}
                          </div>
                        )}

                        {item.type === 'note' && (
                          <div className="text-sm text-gray-600 bg-green-50 rounded p-2">
                            <div className="flex items-center mb-1">
                              <User className="w-4 h-4 mr-1" />
                              <span className="font-medium">{item.technicianName}</span>
                            </div>
                            <p>{item.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Part Summary */}
          <div className="mt-8 bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Part Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Repair Details</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Entered Shop:</span> {formatDateTime(part.enteredShop)}</p>
                  {part.repairStarted && (
                    <p><span className="font-medium">Repair Started:</span> {formatDateTime(part.repairStarted)}</p>
                  )}
                  {part.repairCompleted && (
                    <p><span className="font-medium">Repair Completed:</span> {formatDateTime(part.repairCompleted)}</p>
                  )}
                  {part.repairStarted && part.repairCompleted && (
                    <p><span className="font-medium">Total Repair Time:</span> {formatDuration(part.repairStarted, part.repairCompleted)}</p>
                  )}
                  {part.estimatedHours && (
                    <p><span className="font-medium">Estimated Hours:</span> {part.estimatedHours}h</p>
                  )}
                  {part.actualHours && (
                    <p><span className="font-medium">Actual Hours:</span> {part.actualHours}h</p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Assignment</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  {part.assignedTechnician ? (
                    <p><span className="font-medium">Assigned to:</span> {technicians.find(t => t.id === part.assignedTechnician)?.name}</p>
                  ) : (
                    <p className="text-gray-500">Not assigned</p>
                  )}
                  <p><span className="font-medium">Location:</span> {part.location}</p>
                  <p><span className="font-medium">Work Order:</span> {part.wo}</p>
                  <p><span className="font-medium">Description:</span> {part.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

