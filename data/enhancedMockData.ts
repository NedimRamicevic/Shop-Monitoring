import { Technician, Manager, Part, PartHistoryEntry } from '@/types';

import { Inspector } from '@/types';

export const inspectors: Inspector[] = [
  {
    id: 'i1',
    name: 'Alice Inspector',
    role: 'inspector',
    photo: '/images/alice.jpg',
  },
  // Add more inspectors as needed
];
export const technicians: Technician[] = [
  {
    id: 'tech1',
    name: 'John Smith',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    role: 'technician',
    skills: ['Hydraulics', 'Avionics', 'Engine Systems'],
    stats: {
      repairedCount: { today: 2, week: 8, month: 32 },
      avgRepairTime: 6.5,
      scrapRate: 5.2,
      hoursWorked: { today: 7.5, week: 38, month: 152 },
      efficiency: 85.3,
      onTimeDelivery: 92.1
    },
    badges: ['Speed Demon', 'Quality Master', 'Team Player'],
    joinDate: '2022-03-15'
  },
  {
    id: 'tech2',
    name: 'Sarah Johnson',
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    role: 'technician',
    skills: ['Landing Gear', 'Fuel Systems', 'Navigation'],
    stats: {
      repairedCount: { today: 1, week: 6, month: 28 },
      avgRepairTime: 7.2,
      scrapRate: 3.8,
      hoursWorked: { today: 6.8, week: 35, month: 142 },
      efficiency: 78.9,
      onTimeDelivery: 88.5
    },
    badges: ['Precision Expert', 'Safety First'],
    joinDate: '2021-11-08'
  },
  {
    id: 'tech3',
    name: 'Mike Davis',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    role: 'technician',
    skills: ['Engine Repair', 'APU Systems', 'Troubleshooting'],
    stats: {
      repairedCount: { today: 3, week: 12, month: 45 },
      avgRepairTime: 5.8,
      scrapRate: 7.1,
      hoursWorked: { today: 8.0, week: 40, month: 160 },
      efficiency: 91.2,
      onTimeDelivery: 95.3
    },
    badges: ['Speed Demon', 'Problem Solver', 'Mentor'],
    joinDate: '2020-06-22'
  },
  {
    id: 'tech4',
    name: 'Emily Wilson',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    role: 'technician',
    skills: ['Cabin Systems', 'Environmental Control', 'Electrical'],
    stats: {
      repairedCount: { today: 2, week: 9, month: 38 },
      avgRepairTime: 6.9,
      scrapRate: 4.2,
      hoursWorked: { today: 7.2, week: 36, month: 148 },
      efficiency: 82.7,
      onTimeDelivery: 89.8
    },
    badges: ['Detail Oriented', 'Innovation Leader'],
    joinDate: '2023-01-10'
  },
  {
    id: 'tech5',
    name: 'David Brown',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    role: 'technician',
    skills: ['Structural Repair', 'Composite Materials', 'Quality Control'],
    stats: {
      repairedCount: { today: 1, week: 7, month: 31 },
      avgRepairTime: 8.1,
      scrapRate: 2.9,
      hoursWorked: { today: 6.5, week: 33, month: 135 },
      efficiency: 76.4,
      onTimeDelivery: 85.2
    },
    badges: ['Quality Master', 'Safety First'],
    joinDate: '2022-09-03'
  }
];

export const managers: Manager[] = [
  {
    id: 'mgr1',
    name: 'Robert Taylor',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    role: 'manager'
  },
  {
    id: 'mgr2',
    name: 'Lisa Anderson',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    role: 'manager'
  }
];

// Helper function to generate dates
const generateDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

// Helper function to generate part history
const generatePartHistory = (part: any): PartHistoryEntry[] => {
  const history: PartHistoryEntry[] = [];
  
  // Entry to shop
  history.push({
    id: `entry_${part.id}`,
    timestamp: part.enteredShop,
    action: 'Part entered shop',
    toStatus: 'unrepaired'
  });
  
  // Repair started
  if (part.repairStarted) {
    history.push({
      id: `start_${part.id}`,
      timestamp: part.repairStarted,
      action: 'Repair started',
      fromStatus: 'unrepaired',
      toStatus: 'in-repair',
      technicianId: part.assignedTechnician,
      technicianName: part.updatedBy
    });
  }
  
  // Repair completed
  if (part.repairCompleted) {
    history.push({
      id: `complete_${part.id}`,
      timestamp: part.repairCompleted,
      action: 'Repair completed',
      fromStatus: 'in-repair',
      toStatus: 'repaired',
      technicianId: part.assignedTechnician,
      technicianName: part.updatedBy,
      estimatedHours: part.estimatedHours,
      actualHours: part.actualHours
    });
  }
  
  // Shipped or scrapped
  if (part.shippedDate) {
    history.push({
      id: `ship_${part.id}`,
      timestamp: part.shippedDate,
      action: 'Part shipped',
      fromStatus: 'repaired',
      toStatus: 'shipped',
      technicianId: part.assignedTechnician,
      technicianName: part.updatedBy
    });
  } else if (part.scrappedDate) {
    history.push({
      id: `scrap_${part.id}`,
      timestamp: part.scrappedDate,
      action: 'Part scrapped',
      fromStatus: 'in-repair',
      toStatus: 'scrap',
      technicianId: part.assignedTechnician,
      technicianName: part.updatedBy,
      notes: 'Part deemed unrepairable'
    });
  }
  
  return history;
};

// Create parts with enhanced data structure
const createPart = (partData: any): Part => {
  const history = generatePartHistory(partData);
  const daysInStatus = Math.floor((Date.now() - new Date(partData.enteredShop).getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    ...partData,
    history,
    notes: [],
    isOverdue: daysInStatus > 7 && partData.status === 'unrepaired',
    daysInStatus
  };
};

export const initialParts: Part[] = [
  createPart({
    id: 'part1',
    partNumber: 'PN-001-2024',
    aircraft: 'Boeing 737',
    status: 'unrepaired',
    wo: 'WO-2024-001',
    description: 'Landing gear hydraulic pump',
    lastUpdated: generateDate(0),
    enteredShop: generateDate(5),
    priority: 'high',
    customer: 'Delta Airlines',
    location: 'Bay A-1',
    estimatedHours: 2,
    repairStarted: null,
    assignedTechnician: undefined
  }),
  createPart({
    id: 'part2',
    partNumber: 'PN-002-2024',
    aircraft: 'Airbus A320',
    status: 'in-repair',
    assignedTechnician: 'tech1',
    wo: 'WO-2024-002',
    description: 'Engine fuel injector',
    lastUpdated: generateDate(1),
    updatedBy: 'John Smith',
    enteredShop: generateDate(7),
    repairStarted: generateDate(2),
    priority: 'critical',
    customer: 'American Airlines',
    location: 'Bay B-2',
    estimatedHours: 3,
    actualHours: 2.5
  }),
  createPart({
    id: 'part3',
    partNumber: 'PN-003-2024',
    aircraft: 'Boeing 777',
    status: 'repaired',
    assignedTechnician: 'tech2',
    wo: 'WO-2024-003',
    description: 'Navigation system module',
    lastUpdated: generateDate(1),
    updatedBy: 'Sarah Johnson',
    enteredShop: generateDate(10),
    repairStarted: generateDate(8),
    repairCompleted: generateDate(1),
    priority: 'medium',
    customer: 'United Airlines',
    location: 'Bay C-3',
    estimatedHours: 2,
    actualHours: 1.5
  }),
  createPart({
    id: 'part4',
    partNumber: 'PN-004-2024',
    aircraft: 'Airbus A380',
    status: 'unrepaired',
    wo: 'WO-2024-004',
    description: 'Cabin pressure valve',
    lastUpdated: generateDate(2),
    enteredShop: generateDate(3),
    priority: 'low',
    customer: 'Emirates',
    location: 'Bay D-4',
    estimatedHours: 1,
    repairStarted: null,
    assignedTechnician: undefined
  }),
  createPart({
    id: 'part5',
    partNumber: 'PN-005-2024',
    aircraft: 'Boeing 787',
    status: 'scrap',
    assignedTechnician: 'tech3',
    wo: 'WO-2024-005',
    description: 'Damaged wing flap actuator',
    lastUpdated: generateDate(3),
    updatedBy: 'Mike Davis',
    enteredShop: generateDate(15),
    repairStarted: generateDate(12),
    scrappedDate: generateDate(3),
    priority: 'high',
    customer: 'Southwest Airlines',
    location: 'Scrap Area',
    estimatedHours: 3,
    actualHours: 2.5
  }),
  createPart({
    id: 'part6',
    partNumber: 'PN-006-2024',
    aircraft: 'Airbus A350',
    status: 'shipped',
    assignedTechnician: 'tech4',
    wo: 'WO-2024-006',
    description: 'Avionics control unit',
    lastUpdated: generateDate(4),
    updatedBy: 'Emily Wilson',
    enteredShop: generateDate(20),
    repairStarted: generateDate(18),
    repairCompleted: generateDate(6),
    shippedDate: generateDate(4),
    priority: 'critical',
    customer: 'Lufthansa',
    location: 'Shipped',
    estimatedHours: 3,
    actualHours: 2.5
  }),
  createPart({
    id: 'part7',
    partNumber: 'PN-007-2024',
    aircraft: 'Boeing 747',
    status: 'in-repair',
    assignedTechnician: 'tech5',
    wo: 'WO-2024-007',
    description: 'Thrust reverser mechanism',
    lastUpdated: generateDate(1),
    updatedBy: 'David Brown',
    enteredShop: generateDate(8),
    repairStarted: generateDate(5),
    priority: 'high',
    customer: 'British Airways',
    location: 'Bay E-5',
    estimatedHours: 2.5,
    actualHours: 2
  }),
  createPart({
    id: 'part8',
    partNumber: 'PN-008-2024',
    aircraft: 'Airbus A330',
    status: 'unrepaired',
    wo: 'WO-2024-008',
    description: 'Brake system controller',
    lastUpdated: generateDate(1),
    enteredShop: generateDate(2),
    priority: 'medium',
    customer: 'Air France',
    location: 'Bay F-6',
    estimatedHours: 1.5,
    repairStarted: null,
    assignedTechnician: undefined
  }),
  createPart({
    id: 'part9',
    partNumber: 'PN-009-2024',
    aircraft: 'Boeing 737 MAX',
    status: 'repaired',
    assignedTechnician: 'tech1',
    wo: 'WO-2024-009',
    description: 'Flight control computer',
    lastUpdated: generateDate(2),
    updatedBy: 'John Smith',
    enteredShop: generateDate(12),
    repairStarted: generateDate(10),
    repairCompleted: generateDate(2),
    priority: 'critical',
    customer: 'Ryanair',
    location: 'Bay G-7',
    estimatedHours: 3,
    actualHours: 2.5
  }),
  createPart({
    id: 'part10',
    partNumber: 'PN-010-2024',
    aircraft: 'Airbus A321',
    status: 'in-repair',
    assignedTechnician: 'tech2',
    wo: 'WO-2024-010',
    description: 'Environmental control unit',
    lastUpdated: generateDate(0),
    updatedBy: 'Sarah Johnson',
    enteredShop: generateDate(6),
    repairStarted: generateDate(4),
    priority: 'medium',
    customer: 'KLM',
    location: 'Bay H-8',
    estimatedHours: 2,
    actualHours: 1.5
  }),
  // Additional parts for more comprehensive data
  createPart({
    id: 'part11',
    partNumber: 'PN-011-2024',
    aircraft: 'Boeing 737',
    status: 'unrepaired',
    wo: 'WO-2024-011',
    description: 'APU starter motor',
    lastUpdated: generateDate(1),
    enteredShop: generateDate(4),
    priority: 'low',
    customer: 'JetBlue',
    location: 'Bay I-9',
    estimatedHours: 1.5,
    repairStarted: null,
    assignedTechnician: undefined
  }),
  createPart({
    id: 'part12',
    partNumber: 'PN-012-2024',
    aircraft: 'Airbus A320',
    status: 'in-repair',
    assignedTechnician: 'tech3',
    wo: 'WO-2024-012',
    description: 'Landing gear actuator',
    lastUpdated: generateDate(0),
    updatedBy: 'Mike Davis',
    enteredShop: generateDate(9),
    repairStarted: generateDate(6),
    priority: 'high',
    customer: 'Alaska Airlines',
    location: 'Bay J-10',
    estimatedHours: 2.5,
    actualHours: 2
  }),
  createPart({
    id: 'part13',
    partNumber: 'PN-013-2024',
    aircraft: 'Boeing 777',
    status: 'repaired',
    assignedTechnician: 'tech4',
    wo: 'WO-2024-013',
    description: 'Fuel pump assembly',
    lastUpdated: generateDate(3),
    updatedBy: 'Emily Wilson',
    enteredShop: generateDate(14),
    repairStarted: generateDate(11),
    repairCompleted: generateDate(3),
    priority: 'medium',
    customer: 'Virgin Atlantic',
    location: 'Bay K-11',
    estimatedHours: 2,
    actualHours: 1.5
  }),
  createPart({
    id: 'part14',
    partNumber: 'PN-014-2024',
    aircraft: 'Airbus A380',
    status: 'shipped',
    assignedTechnician: 'tech5',
    wo: 'WO-2024-014',
    description: 'Cockpit display unit',
    lastUpdated: generateDate(5),
    updatedBy: 'David Brown',
    enteredShop: generateDate(25),
    repairStarted: generateDate(22),
    repairCompleted: generateDate(8),
    shippedDate: generateDate(5),
    priority: 'critical',
    customer: 'Singapore Airlines',
    location: 'Shipped',
    estimatedHours: 3,
    actualHours: 2.5
  }),
  createPart({
    id: 'part15',
    partNumber: 'PN-015-2024',
    aircraft: 'Boeing 787',
    status: 'unrepaired',
    wo: 'WO-2024-015',
    description: 'Hydraulic reservoir',
    lastUpdated: generateDate(0),
    enteredShop: generateDate(1),
    priority: 'low',
    customer: 'Qantas',
    location: 'Bay L-12',
    estimatedHours: 1,
    repairStarted: null,
    assignedTechnician: undefined
  })
];

