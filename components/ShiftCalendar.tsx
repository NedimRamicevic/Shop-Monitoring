import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Technician } from '../types';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = Array.from({ length: 8 }, (_, i) => `${i + 8}:00`); // 8am-3pm

const ShiftCalendar: React.FC = () => {
  const { technicians } = useStore();
  const [selectedTech, setSelectedTech] = useState<string>(technicians[0]?.id || '');
  const [shifts, setShifts] = useState<Record<string, Record<string, string[]>>>({});

  const handleAssign = (day: string, hour: string) => {
    setShifts(prev => ({
      ...prev,
      [selectedTech]: {
        ...(prev[selectedTech] || {}),
        [day]: [...(prev[selectedTech]?.[day] || []), hour]
      }
    }));
  };

  return (
    <div className="p-6 bg-white rounded shadow max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Shift/Calendar View</h2>
      <div className="mb-4 flex gap-2">
        <label className="font-semibold">Technician:</label>
        <select value={selectedTech} onChange={e => setSelectedTech(e.target.value)} className="border rounded px-2 py-1">
          {technicians.map(tech => (
            <option key={tech.id} value={tech.id}>{tech.name}</option>
          ))}
        </select>
      </div>
      <table className="w-full border mb-4">
        <thead>
          <tr>
            <th className="p-2">Day</th>
            {hours.map(hour => (
              <th key={hour} className="p-2">{hour}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map(day => (
            <tr key={day}>
              <td className="p-2 font-semibold">{day}</td>
              {hours.map(hour => (
                <td key={hour} className="p-2">
                  <button
                    className={`px-2 py-1 rounded text-xs ${shifts[selectedTech]?.[day]?.includes(hour) ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                    onClick={() => handleAssign(day, hour)}
                  >
                    {shifts[selectedTech]?.[day]?.includes(hour) ? 'Assigned' : 'Assign'}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <span className="font-semibold">Assigned Shifts:</span>
        <ul className="list-disc ml-6 mt-2 text-sm">
          {Object.entries(shifts[selectedTech] || {}).map(([day, hours]) => (
            <li key={day}>{day}: {hours.join(', ')}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ShiftCalendar;
