import { Part, PersonnelStats, Technician, PartPerformanceDetail } from '@/types';
import { technicians } from '@/data/mockData';

export const calculatePersonnelStats = (parts: Part[]): PersonnelStats[] => {
  return technicians.map(technician => {
    const technicianParts = parts.filter(part => part.assignedTechnician === technician.id);
    
    const completedParts = technicianParts.filter(part => part.status === 'repaired' || part.status === 'shipped');
    const inProgressParts = technicianParts.filter(part => part.status === 'in-repair');
    const scrappedParts = technicianParts.filter(part => part.status === 'scrap');
    
    // Calculate average repair time
    const partsWithActualHours = completedParts.filter(part => part.actualHours);
    const totalActualHours = partsWithActualHours.reduce((sum, part) => sum + (part.actualHours || 0), 0);
    const averageRepairTime = partsWithActualHours.length > 0 ? totalActualHours / partsWithActualHours.length : 0;
    
    // Calculate efficiency (actual vs estimated hours)
    const partsWithBothHours = completedParts.filter(part => part.actualHours && part.estimatedHours);
    const totalEstimatedHours = partsWithBothHours.reduce((sum, part) => sum + (part.estimatedHours || 0), 0);
    const totalActualHoursForEfficiency = partsWithBothHours.reduce((sum, part) => sum + (part.actualHours || 0), 0);
    const efficiency = totalEstimatedHours > 0 ? Math.max(0, ((totalEstimatedHours - totalActualHoursForEfficiency) / totalEstimatedHours) * 100) : 0;
    
    // Calculate on-time delivery (parts completed within estimated time)
    const onTimeParts = partsWithBothHours.filter(part => (part.actualHours || 0) <= (part.estimatedHours || 0));
    const onTimeDelivery = partsWithBothHours.length > 0 ? (onTimeParts.length / partsWithBothHours.length) * 100 : 0;
    
    // Calculate total hours worked
    const totalHoursWorked = technicianParts.reduce((sum, part) => sum + (part.actualHours || 0), 0);
    
    // Find last activity
    const lastActivity = technicianParts.length > 0 
      ? technicianParts.reduce((latest, part) => {
          const partDate = new Date(part.lastUpdated || 0);
          const latestDate = new Date(latest.lastUpdated || 0);
          return partDate > latestDate ? part : latest;
        }).lastUpdated || ''
      : '';

    // Create detailed part performance data
    const partDetails: PartPerformanceDetail[] = technicianParts.map(part => {
      const partEfficiency = part.estimatedHours && part.actualHours 
        ? Math.max(0, ((part.estimatedHours - part.actualHours) / part.estimatedHours) * 100)
        : 0;
      
      const onTime = part.actualHours ? part.actualHours <= (part.estimatedHours || 0) : false;

      return {
        partId: part.id,
        partNumber: part.partNumber,
        aircraft: part.aircraft,
        status: part.status,
        estimatedHours: part.estimatedHours || 0,
        actualHours: part.actualHours,
        efficiency: Math.round(partEfficiency * 10) / 10,
        onTime,
        enteredShop: part.enteredShop,
        repairStarted: part.repairStarted,
        repairCompleted: part.repairCompleted,
        customer: part.customer,
        priority: part.priority
      };
    });

    return {
      technicianId: technician.id,
      technicianName: technician.name,
      totalPartsAssigned: technicianParts.length,
      partsCompleted: completedParts.length,
      partsInProgress: inProgressParts.length,
      partsScrapped: scrappedParts.length,
      averageRepairTime: Math.round(averageRepairTime * 10) / 10,
      efficiency: Math.round(efficiency * 10) / 10,
      onTimeDelivery: Math.round(onTimeDelivery * 10) / 10,
      totalHoursWorked: Math.round(totalHoursWorked * 10) / 10,
      lastActivity,
      partDetails
    };
  });
};

export const getTopPerformers = (stats: PersonnelStats[], metric: keyof PersonnelStats, limit: number = 3): PersonnelStats[] => {
  return [...stats]
    .sort((a, b) => {
      if (metric === 'averageRepairTime') {
        return a[metric] - b[metric]; // Lower is better for repair time
      }
      return b[metric] - a[metric]; // Higher is better for other metrics
    })
    .slice(0, limit);
};

export const getOverallStats = (stats: PersonnelStats[]) => {
  const totalParts = stats.reduce((sum, stat) => sum + stat.totalPartsAssigned, 0);
  const totalCompleted = stats.reduce((sum, stat) => sum + stat.partsCompleted, 0);
  const totalHours = stats.reduce((sum, stat) => sum + stat.totalHoursWorked, 0);
  const avgEfficiency = stats.length > 0 ? stats.reduce((sum, stat) => sum + stat.efficiency, 0) / stats.length : 0;
  const avgOnTimeDelivery = stats.length > 0 ? stats.reduce((sum, stat) => sum + stat.onTimeDelivery, 0) / stats.length : 0;

  return {
    totalParts,
    totalCompleted,
    totalHours: Math.round(totalHours * 10) / 10,
    avgEfficiency: Math.round(avgEfficiency * 10) / 10,
    avgOnTimeDelivery: Math.round(avgOnTimeDelivery * 10) / 10,
    completionRate: totalParts > 0 ? Math.round((totalCompleted / totalParts) * 100 * 10) / 10 : 0
  };
};
