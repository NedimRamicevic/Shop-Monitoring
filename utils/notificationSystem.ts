import { useStore } from '@/store/useStore';
import { Part, Technician } from '@/types';

export class NotificationSystem {
  private static instance: NotificationSystem;
  private store: any;

  private constructor() {
    this.store = useStore.getState();
  }

  public static getInstance(): NotificationSystem {
    if (!NotificationSystem.instance) {
      NotificationSystem.instance = new NotificationSystem();
    }
    return NotificationSystem.instance;
  }

  // Check for overdue parts
  public checkOverdueParts(parts: Part[]) {
    const overdueParts = parts.filter(part => part.isOverdue);
    
    overdueParts.forEach(part => {
      this.store.addNotification({
        type: 'warning',
        title: 'Overdue Part Alert',
        message: `Part ${part.partNumber} has been in ${part.status} status for ${part.daysInStatus} days`,
        timestamp: new Date().toISOString(),
        read: false,
        partId: part.id
      });
    });
  }

  // Check for technician capacity warnings
  public checkTechnicianCapacity(technicians: Technician[], parts: Part[]) {
    technicians.forEach(tech => {
      const assignedParts = parts.filter(p => p.assignedTechnician === tech.id && p.status === 'in-repair');
      const totalHours = assignedParts.reduce((sum, part) => sum + (part.estimatedHours || 0), 0);
      const utilization = (totalHours / 8) * 100; // 8 hours daily capacity

      if (utilization >= 100) {
        this.store.addNotification({
          type: 'error',
          title: 'Technician Overloaded',
          message: `${tech.name} is at ${utilization.toFixed(0)}% capacity (${totalHours.toFixed(1)}h/8h)`,
          timestamp: new Date().toISOString(),
          read: false,
          technicianId: tech.id
        });
      } else if (utilization >= 80) {
        this.store.addNotification({
          type: 'warning',
          title: 'Technician Near Capacity',
          message: `${tech.name} is at ${utilization.toFixed(0)}% capacity (${totalHours.toFixed(1)}h/8h)`,
          timestamp: new Date().toISOString(),
          read: false,
          technicianId: tech.id
        });
      }
    });
  }

  // Check for high scrap rates
  public checkScrapRates(technicians: Technician[]) {
    technicians.forEach(tech => {
      if (tech.stats.scrapRate > 10) {
        this.store.addNotification({
          type: 'warning',
          title: 'High Scrap Rate Alert',
          message: `${tech.name} has a scrap rate of ${tech.stats.scrapRate}% (above 10% threshold)`,
          timestamp: new Date().toISOString(),
          read: false,
          technicianId: tech.id
        });
      }
    });
  }

  // Check for backlog growth
  public checkBacklogGrowth(parts: Part[]) {
    const unrepairedCount = parts.filter(p => p.status === 'unrepaired').length;
    const totalParts = parts.length;
    const backlogPercentage = (unrepairedCount / totalParts) * 100;

    if (backlogPercentage > 50) {
      this.store.addNotification({
        type: 'error',
        title: 'High Backlog Alert',
        message: `Backlog is at ${backlogPercentage.toFixed(0)}% (${unrepairedCount}/${totalParts} parts unrepaired)`,
        timestamp: new Date().toISOString(),
        read: false
      });
    } else if (backlogPercentage > 30) {
      this.store.addNotification({
        type: 'warning',
        title: 'Backlog Growing',
        message: `Backlog is at ${backlogPercentage.toFixed(0)}% (${unrepairedCount}/${totalParts} parts unrepaired)`,
        timestamp: new Date().toISOString(),
        read: false
      });
    }
  }

  // Check for parts stuck in status
  public checkStuckParts(parts: Part[]) {
    const stuckThreshold = 3; // days
    
    parts.forEach(part => {
      if (part.daysInStatus > stuckThreshold && part.status !== 'shipped') {
        this.store.addNotification({
          type: 'info',
          title: 'Part Stuck in Status',
          message: `Part ${part.partNumber} has been in ${part.status} status for ${part.daysInStatus} days`,
          timestamp: new Date().toISOString(),
          read: false,
          partId: part.id
        });
      }
    });
  }

  // Check for performance milestones
  public checkPerformanceMilestones(technicians: Technician[]) {
    technicians.forEach(tech => {
      // Weekly milestone
      if (tech.stats.repairedCount.week >= 10) {
        this.store.addNotification({
          type: 'success',
          title: 'Weekly Milestone Achieved!',
          message: `${tech.name} has completed ${tech.stats.repairedCount.week} parts this week!`,
          timestamp: new Date().toISOString(),
          read: false,
          technicianId: tech.id
        });
      }

      // Monthly milestone
      if (tech.stats.repairedCount.month >= 30) {
        this.store.addNotification({
          type: 'success',
          title: 'Monthly Milestone Achieved!',
          message: `${tech.name} has completed ${tech.stats.repairedCount.month} parts this month!`,
          timestamp: new Date().toISOString(),
          read: false,
          technicianId: tech.id
        });
      }

      // Efficiency milestone
      if (tech.stats.efficiency >= 95) {
        this.store.addNotification({
          type: 'success',
          title: 'Efficiency Excellence!',
          message: `${tech.name} has achieved ${tech.stats.efficiency}% efficiency!`,
          timestamp: new Date().toISOString(),
          read: false,
          technicianId: tech.id
        });
      }
    });
  }

  // Check for critical parts
  public checkCriticalParts(parts: Part[]) {
    const criticalParts = parts.filter(p => p.priority === 'critical' && p.status === 'unrepaired');
    
    criticalParts.forEach(part => {
      this.store.addNotification({
        type: 'error',
        title: 'Critical Part Alert',
        message: `Critical part ${part.partNumber} is unrepaired and needs immediate attention`,
        timestamp: new Date().toISOString(),
        read: false,
        partId: part.id
      });
    });
  }

  // Run all checks
  public runAllChecks(parts: Part[], technicians: Technician[]) {
    this.checkOverdueParts(parts);
    this.checkTechnicianCapacity(technicians, parts);
    this.checkScrapRates(technicians);
    this.checkBacklogGrowth(parts);
    this.checkStuckParts(parts);
    this.checkPerformanceMilestones(technicians);
    this.checkCriticalParts(parts);
  }

  // Schedule periodic checks
  public startPeriodicChecks(parts: Part[], technicians: Technician[], intervalMinutes: number = 30) {
    setInterval(() => {
      this.runAllChecks(parts, technicians);
    }, intervalMinutes * 60 * 1000);
  }
}

// Export singleton instance
export const notificationSystem = NotificationSystem.getInstance();

