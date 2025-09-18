import { create } from 'zustand';
import { Part, Technician, Manager, Inspector, User, Notification, PartHistoryEntry } from '@/types';
import { initialParts, technicians, managers } from '@/data/enhancedMockData';

interface AppState {
  // Current user
  currentUser: User | null;
  
  // Data
  parts: Part[];
  technicians: Technician[];
  managers: Manager[];
  notifications: Notification[];
  
  // UI state
  currentScreen: string;
  
  // Actions
  setCurrentUser: (user: User | null) => void;
  setCurrentScreen: (screen: string) => void;
  
  // Part actions
  updatePart: (partId: string, updates: Partial<Part>) => void;
  addPartHistory: (partId: string, historyEntry: Omit<PartHistoryEntry, 'id'>) => void;
  addPartNote: (partId: string, note: string, technicianId: string) => void;
  
  // Technician actions
  updateTechnicianStats: (technicianId: string, updates: Partial<Technician['stats']>) => void;
  addTechnicianBadge: (technicianId: string, badge: string) => void;
  
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  markNotificationRead: (notificationId: string) => void;
  clearAllNotifications: () => void;
  
  // Bulk operations
  bulkAssignParts: (partIds: string[], technicianId: string) => void;
  bulkUpdateStatus: (partIds: string[], status: Part['status']) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  currentUser: null,
  parts: initialParts,
  technicians: technicians,
  managers: managers,
  notifications: [],
  currentScreen: 'login',
  
  // Actions
  setCurrentUser: (user) => set({ currentUser: user }),
  setCurrentScreen: (screen) => set({ currentScreen: screen }),
  
  // Part actions
  updatePart: (partId, updates) => {
    set((state) => ({
      parts: state.parts.map(part => 
        part.id === partId 
          ? { 
              ...part, 
              ...updates, 
              lastUpdated: new Date().toISOString(),
              daysInStatus: updates.status ? 0 : part.daysInStatus + 1,
              isOverdue: updates.status ? false : part.isOverdue
            }
          : { ...part, daysInStatus: part.daysInStatus + 1 }
      )
    }));
  },
  
  addPartHistory: (partId, historyEntry) => {
    const newEntry: PartHistoryEntry = {
      ...historyEntry,
      id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    set((state) => ({
      parts: state.parts.map(part => 
        part.id === partId 
          ? { ...part, history: [...part.history, newEntry] }
          : part
      )
    }));
  },
  
  addPartNote: (partId, note, technicianId) => {
    const technician = get().technicians.find(t => t.id === technicianId);
    const timestamp = new Date().toISOString();
    const noteWithMetadata = `${timestamp} - ${technician?.name}: ${note}`;
    
    set((state) => ({
      parts: state.parts.map(part => 
        part.id === partId 
          ? { ...part, notes: [...part.notes, noteWithMetadata] }
          : part
      )
    }));
    
    // Add to history
    get().addPartHistory(partId, {
      timestamp,
      action: 'Note added',
      technicianId,
      technicianName: technician?.name,
      notes: note
    });
  },
  
  // Technician actions
  updateTechnicianStats: (technicianId, updates) => {
    set((state) => ({
      technicians: state.technicians.map(tech => 
        tech.id === technicianId 
          ? { ...tech, stats: { ...tech.stats, ...updates } }
          : tech
      )
    }));
  },
  
  addTechnicianBadge: (technicianId, badge) => {
    set((state) => ({
      technicians: state.technicians.map(tech => 
        tech.id === technicianId 
          ? { ...tech, badges: [...tech.badges, badge] }
          : tech
      )
    }));
  },
  
  // Notification actions
  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    set((state) => ({
      notifications: [newNotification, ...state.notifications]
    }));
  },
  
  markNotificationRead: (notificationId) => {
    set((state) => ({
      notifications: state.notifications.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    }));
  },
  
  clearAllNotifications: () => {
    set({ notifications: [] });
  },
  
  // Bulk operations
  bulkAssignParts: (partIds, technicianId) => {
    const technician = get().technicians.find(t => t.id === technicianId);
    partIds.forEach(partId => {
      get().updatePart(partId, {
        assignedTechnician: technicianId,
        // Do NOT set status or repairStarted here
        updatedBy: technician?.name
      });
      get().addPartHistory(partId, {
        timestamp: new Date().toISOString(),
        action: 'Assigned to technician',
        toStatus: 'unrepaired',
        technicianId,
        technicianName: technician?.name
      });
    });
  },
  
  bulkUpdateStatus: (partIds, status) => {
    partIds.forEach(partId => {
      const part = get().parts.find(p => p.id === partId);
      if (!part) return;
      
      const updates: Partial<Part> = { status };
      
      // Set specific timestamps based on status
      if (status === 'in-repair' && part.status === 'unrepaired') {
        updates.repairStarted = new Date().toISOString();
      } else if (status === 'repaired' && part.status === 'in-repair') {
        updates.repairCompleted = new Date().toISOString();
      } else if (status === 'shipped' && part.status === 'repaired') {
        updates.shippedDate = new Date().toISOString();
      } else if (status === 'scrap') {
        updates.scrappedDate = new Date().toISOString();
      }
      
      get().updatePart(partId, updates);
      
      get().addPartHistory(partId, {
        timestamp: new Date().toISOString(),
        action: `Status changed to ${status}`,
        fromStatus: part.status,
        toStatus: status,
        technicianId: part.assignedTechnician,
        technicianName: part.updatedBy
      });
    });
  }
}));
