export interface Technician {
  id: string;
  name: string;
  photo: string;
  role: 'technician';
  skills: string[];
  stats: {
    repairedCount: {
      today: number;
      week: number;
      month: number;
    };
    avgRepairTime: number;
    scrapRate: number;
    hoursWorked: {
      today: number;
      week: number;
      month: number;
    };
    efficiency: number;
    onTimeDelivery: number;
  };
  badges: string[];
  joinDate: string;
}

export interface Inspector {
  id: string;
  name: string;
  photo: string;
  role: 'inspector';
}

export interface Manager {
  id: string;
  name: string;
  photo: string;
  role: 'manager';
}

export type User = Technician | Manager | Inspector;

export type PartStatus = 'unrepaired' | 'in-repair' | 'repaired' | 'scrap' | 'shipped';

export interface PartHistoryEntry {
  id: string;
  timestamp: string;
  action: string;
  fromStatus?: PartStatus;
  toStatus?: PartStatus;
  technicianId?: string;
  technicianName?: string;
  notes?: string;
  estimatedHours?: number;
  actualHours?: number;
}

export interface Part {
  id: string;
  partNumber: string;
  aircraft: string;
  status: PartStatus;
  assignedTechnician?: string;
  wo: string;
  description?: string;
  lastUpdated?: string;
  updatedBy?: string;
  // New tracking fields
  enteredShop: string; // When part entered the shop
  repairStarted?: string; // When repair started
  repairCompleted?: string; // When repair completed
  shippedDate?: string; // When part was shipped
  scrappedDate?: string; // When part was scrapped
  estimatedHours?: number; // Estimated repair hours
  actualHours?: number; // Actual repair hours
  priority: 'low' | 'medium' | 'high' | 'critical';
  customer: string;
  location: string; // Where part is stored
  history: PartHistoryEntry[]; // Complete history log
  notes: string[]; // Technician notes
  isOverdue: boolean; // Calculated field
  daysInStatus: number; // Days in current status
  // New fields for enhanced functionality
  qrCode?: string; // Generated QR code data
  rfidUid?: string; // RFID UID if available
  nfcUid?: string; // NFC UID if available
  photos: string[]; // Array of photo URLs/base64 data
  intakePhoto?: string; // Photo taken at intake
  intakeNotes?: string; // Notes from intake process
  serialNumber?: string; // Part serial number
  manufacturer?: string; // Part manufacturer
  partType?: string; // Type/category of part
}

export interface Statistics {
  unrepaired: number;
  inRepair: number;
  repaired: number;
  scrap: number;
  shipped: number;
}

export interface PersonnelStats {
  technicianId: string;
  technicianName: string;
  totalPartsAssigned: number;
  partsCompleted: number;
  partsInProgress: number;
  partsScrapped: number;
  averageRepairTime: number; // in hours
  efficiency: number; // percentage
  onTimeDelivery: number; // percentage
  totalHoursWorked: number;
  lastActivity: string;
  partDetails: PartPerformanceDetail[];
}

export interface PartPerformanceDetail {
  partId: string;
  partNumber: string;
  aircraft: string;
  status: PartStatus;
  estimatedHours: number;
  actualHours?: number;
  efficiency: number; // percentage
  onTime: boolean;
  enteredShop: string;
  repairStarted?: string;
  repairCompleted?: string;
  customer: string;
  priority: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  technicianId?: string;
  partId?: string;
}

export interface ShopAnalytics {
  totalParts: number;
  completedToday: number;
  overdueRepairs: number;
  mttr: number; // Mean Time to Repair
  scrapRate: number;
  shippedRate: number;
  backlogTrend: Array<{ date: string; count: number }>;
  workloadDistribution: Array<{ technician: string; workload: number }>;
}

export type Screen =
  | 'login'
  | 'manager-dashboard'
  | 'technician-workspace'
  | 'part-detail'
  | 'analytics'
  | 'assignments'
  | 'incoming-part-registration';
