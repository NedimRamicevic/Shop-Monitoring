import React from 'react';
import { useStore } from '../store/useStore';
import { Technician } from '../types';

interface TechnicianProfileProps {
  technicianId: string;
}

const TechnicianProfile: React.FC<TechnicianProfileProps> = ({ technicianId }) => {
  const { technicians } = useStore();
  const tech = technicians.find(t => t.id === technicianId);

  if (!tech) return <div className="p-4">Technician not found.</div>;

  const { stats } = tech;

  return (
    <div className="p-6 bg-white rounded shadow max-w-md mx-auto">
      <div className="flex items-center mb-4">
        <img src={tech.photo} alt={tech.name} className="w-16 h-16 rounded-full mr-4" />
        <div>
          <h2 className="text-xl font-bold">{tech.name}</h2>
          <div className="text-sm text-gray-500">Joined: {tech.joinDate}</div>
        </div>
      </div>
      <div className="mb-4">
        <span className="font-semibold">Skills:</span> {tech.skills.join(', ')}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Badges:</span> {tech.badges.length ? tech.badges.join(', ') : 'None'}
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="font-semibold">Repaired (month):</div>
          <div>{stats.repairedCount.month}</div>
        </div>
        <div>
          <div className="font-semibold">Scrap Rate:</div>
          <div>{stats.scrapRate}%</div>
        </div>
        <div>
          <div className="font-semibold">Avg Repair Time:</div>
          <div>{stats.avgRepairTime} hrs</div>
        </div>
        <div>
          <div className="font-semibold">Efficiency:</div>
          <div>{stats.efficiency}%</div>
        </div>
        <div>
          <div className="font-semibold">On-Time Delivery:</div>
          <div>{stats.onTimeDelivery}%</div>
        </div>
      </div>
      <div className="mt-4">
        <span className="font-semibold">Recent Activity:</span>
        <ul className="list-disc ml-6 mt-2 text-sm">
          <li>Parts repaired today: {stats.repairedCount.today}</li>
          <li>Hours worked today: {stats.hoursWorked.today}</li>
          <li>Last badge: {tech.badges[tech.badges.length - 1] || 'None'}</li>
        </ul>
      </div>
    </div>
  );
};

export default TechnicianProfile;
