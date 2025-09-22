'use client';

import { Inspector, Part } from '@/types';
import { Home } from 'lucide-react';

interface InspectorDashboardProps {
  inspector: Inspector;
  parts: Part[];
  onLogout: () => void;
  onRegisterPart: () => void;
  onUpdatePart: (partId: string, updates: Partial<Part>) => void;
}

export default function InspectorDashboard({ inspector, parts, onLogout, onRegisterPart, onUpdatePart }: InspectorDashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img
                src={inspector.photo}
                alt={inspector.name}
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Inspector Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {inspector.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={onRegisterPart}
                className="btn-primary flex items-center"
              >
                Register Incoming Part
              </button>
              <button
                onClick={onLogout}
                className="btn-secondary flex items-center"
              >
                <Home className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Main content: Add inspector-specific features here */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-6 text-left">Parts List</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Part Number</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {parts.filter((part: Part) => part.status === 'repaired' || part.status === 'scrap').map((part: Part) => (
                <tr key={part.id}>
                  <td className="px-4 py-2 font-medium text-gray-900">{part.partNumber}</td>
                  <td className="px-4 py-2 capitalize text-xs text-gray-700">{part.status.replace('-', ' ')}</td>
                  <td className="px-4 py-2 flex gap-2">
                    {part.status === 'repaired' && (
                      <button
                        className="btn-primary flex items-center text-xs px-2 py-1 rounded"
                        onClick={() => onUpdatePart(part.id, { status: 'shipped' })}
                      >
                        Send
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
